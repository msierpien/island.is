import { Injectable, Inject } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
} from '@island.is/api/domains/syslumenn'
import {
  getSelectedChildrenFromExternalData,
  formatDate,
  childrenResidenceInfo,
} from '@island.is/application/templates/family-matters-core/utils'
import { Override } from '@island.is/application/templates/family-matters-core/types'
import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { S3 } from 'aws-sdk'
import { SharedTemplateApiService } from '../../shared'
import {
  generateApplicationSubmittedEmail,
  generateSyslumennNotificationEmail,
  transferRequestedEmail,
} from './emailGenerators'
import { Application } from '@island.is/application/core'
import { SmsService } from '@island.is/nova-sms'
import { syslumennDataFromPostalCode } from './utils'
import { applicationRejectedEmail } from './emailGenerators/applicationRejected'

export const PRESIGNED_BUCKET = 'PRESIGNED_BUCKET'

type props = Override<
  TemplateApiModuleActionProps,
  { application: CRCApplication }
>

@Injectable()
export class ChildrenResidenceChangeService {
  s3: S3

  constructor(
    private readonly syslumennService: SyslumennService,
    @Inject(PRESIGNED_BUCKET) private readonly presignedBucket: string,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly smsService: SmsService,
  ) {
    this.s3 = new S3()
  }

  async submitApplication({ application }: props) {
    const { answers, externalData } = application
    const { nationalRegistry } = externalData
    const applicant = nationalRegistry.data
    const s3FileName = `children-residence-change/${application.id}.pdf`
    const file = await this.s3
      .getObject({ Bucket: this.presignedBucket, Key: s3FileName })
      .promise()
    const fileContent = file.Body as Buffer

    const selectedChildren = getSelectedChildrenFromExternalData(
      applicant.children,
      answers.selectedChildren,
    )

    const otherParent = selectedChildren[0].otherParent

    const childResidenceInfo = childrenResidenceInfo(
      applicant,
      answers.selectedChildren,
    )
    const currentAddress = childResidenceInfo.current.address

    if (!fileContent) {
      throw new Error('File content was undefined')
    }

    const attachment: Attachment = {
      name: `Lögheimilisbreyting-barns-${applicant.nationalId}.pdf`,
      content: fileContent.toString('base64'),
    }

    const parentA: Person = {
      name: applicant.fullName,
      ssn: applicant.nationalId,
      phoneNumber: answers.parentA.phoneNumber,
      email: answers.parentA.email,
      homeAddress: applicant.address.streetName,
      postalCode: applicant.address.postalCode,
      city: applicant.address.city,
      signed: true,
      type: PersonType.Plaintiff,
    }

    const parentB: Person = {
      name: otherParent.fullName,
      ssn: otherParent.nationalId,
      phoneNumber: answers.parentB.phoneNumber,
      email: answers.parentB.email,
      homeAddress: otherParent.address.streetName,
      postalCode: otherParent.address.postalCode,
      city: otherParent.address.city,
      signed: true,
      type: PersonType.CounterParty,
    }

    const participants: Array<Person> = selectedChildren.map((child) => {
      return {
        name: child.fullName,
        ssn: child.nationalId,
        homeAddress: currentAddress.streetName,
        postalCode: currentAddress.postalCode,
        city: currentAddress.city,
        signed: false,
        type: PersonType.Child,
      }
    })

    participants.push(parentA, parentB)

    const durationType = answers.selectDuration?.type
    const durationDate = answers.selectDuration?.date
    const extraData = {
      reasonForChildrenResidenceChange: answers.residenceChangeReason ?? '',
      transferExpirationDate:
        durationType === 'temporary' && durationDate
          ? formatDate({ date: durationDate, formatter: 'dd.MM.yyyy' })
          : durationType,
    }

    const syslumennData = syslumennDataFromPostalCode(
      childResidenceInfo.future.address.postalCode,
    )

    const uploadDataName = 'Lögheimilisbreyting barns'

    const response = await this.syslumennService
      .uploadData(participants, attachment, extraData, uploadDataName)
      .catch(async () => {
        await this.sharedTemplateAPIService.sendEmailWithAttachment(
          generateSyslumennNotificationEmail,
          (application as unknown) as Application,
          fileContent.toString('binary'),
          syslumennData.email,
        )
        return undefined
      })

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationSubmittedEmail(
          props,
          fileContent.toString('binary'),
          answers.parentA.email,
          syslumennData.name,
          response?.malsnumer,
        ),
      (application as unknown) as Application,
    )

    await this.sharedTemplateAPIService.sendEmail(
      (props) =>
        generateApplicationSubmittedEmail(
          props,
          fileContent.toString('binary'),
          answers.parentB.email,
          syslumennData.name,
          response?.malsnumer,
        ),
      (application as unknown) as Application,
    )

    return response
  }

  async sendNotificationToCounterParty({ application }: props) {
    const { answers } = application
    const { counterParty } = answers

    if (counterParty.email) {
      await this.sharedTemplateAPIService.sendEmail(
        transferRequestedEmail,
        (application as unknown) as Application,
      )
    }

    if (counterParty.phoneNumber) {
      await this.smsService.sendSms(
        counterParty.phoneNumber,
        'Þér hafa borist drög að samningi um breytt lögheimili barna og meðlag á Island.is. Samningurinn er aðgengilegur á island.is/minarsidur undir Umsóknir.',
      )
    }
  }

  async rejectApplication({ application }: props) {
    await this.sharedTemplateAPIService.sendEmail(
      applicationRejectedEmail,
      (application as unknown) as Application,
    )
  }
}
