import get from 'lodash/get'
import {
  Agency,
  ComplaintDto,
  ContactInfo,
  ContactRole,
  TargetOfComplaint,
} from './models'
import {
  OnBehalf,
  onBehalfValueLabelMapper,
  SubjectOfComplaint,
  DataProtectionComplaint,
  yesNoValueLabelMapper,
} from '@island.is/application/templates/data-protection-complaint'
import { Application } from '@island.is/application/core'
import * as kennitala from 'kennitala'
import {
  CreateCaseRequest,
  CreateQuickCaseRequest,
  DocumentInfo,
  LinkedContact,
  Metadata,
} from '@island.is/clients/data-protection-complaint'
import { subjectOfComplaintToGoProValues } from './mappers/complaintCategoryMapper'

const extractAnswer = <T>(
  object: unknown,
  path: string,
  defaultValue: unknown | undefined = undefined,
): T => {
  const value = get(object, path, defaultValue)
  if (defaultValue === undefined && typeof value === 'undefined') {
    throw new Error(`ComplaintDto.extractAnswer: missing value for ${path}`)
  }

  return value
}

export const getComplaintTargets = (
  answers: DataProtectionComplaint,
): TargetOfComplaint[] => {
  const targets = extractAnswer<TargetOfComplaint[]>(answers, 'complainees', [])
  return targets
}

export const getAgencies = (answers: DataProtectionComplaint): Agency[] => {
  return extractAnswer<Agency[]>(answers, 'commissions.persons', [])
}

export const getAndFormatOnBehalf = (application: Application): string => {
  const onBehalf = extractAnswer<OnBehalf>(application.answers, 'info.onBehalf')

  return onBehalfValueLabelMapper[onBehalf].defaultMessage
}

export const getAndFormatSubjectsOfComplaint = (
  answers: DataProtectionComplaint,
): string[] => {
  const values = extractAnswer<SubjectOfComplaint[]>(
    answers,
    'subjectOfComplaint.values',
  )

  const categories = values.reduce((acc: string[], value) => {
    const val = subjectOfComplaintToGoProValues(value)

    if (Array.isArray(val)) return [...acc, ...val]

    acc.push(val)
    return acc
  }, [])

  return [...new Set(categories)]
}

export const gatherContacts = (
  answers: DataProtectionComplaint,
): LinkedContact[] => {
  const contact = getContactInfo(answers)
  //Kvartandi - main contact
  const complaintant = {
    type: getContactType(contact.nationalId),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    address: contact.address,
    city: contact.city,
    idnumber: contact.nationalId,
    postalCode: contact.postalCode,
    role: ContactRole.COMPLAINTANT,
    primary: 'false',
    webPage: '',
  }

  //Ábyrgðaraðili - subject of complaint
  const complainees = getComplaintTargets(answers).map(
    (target: TargetOfComplaint, index: number) => {
      return {
        type: getContactType(target.nationalId),
        name: target.name,
        address: target.address,
        idnumber: target.nationalId,
        role: ContactRole.RESPONSIBLE,
        primary: index === 0 ? 'true' : 'false',
        webPage: '',
      }
    },
  )

  const agencies = getAgencies(answers).map((agency: Agency) => {
    return {
      type: getContactType(agency.nationalId),
      name: agency.name,
      address: '',
      idnumber: agency.nationalId,
      role: ContactRole.CLIENT,
      primary: 'false',
      webPage: '',
    }
  })

  return [complaintant, ...complainees, ...agencies]
}

export const getContactType = (nationalId: string): string => {
  return kennitala.isCompany(nationalId) ? 'Company' : 'Individual'
}

export const applicationToQuickCaseRequest = (
  application: Application,
): CreateQuickCaseRequest => {
  const answers = application.answers as DataProtectionComplaint

  return {
    category: 'Kvörtun',
    subject: 'kvörtun frá ísland.is',
    keywords: getAndFormatSubjectsOfComplaint(answers),
    metadata: toRequestMetadata(answers),
    template: 'Kvörtun',
  }
}

export const applicationToCaseRequest = async (
  application: Application,
  attachments: DocumentInfo[],
): Promise<CreateCaseRequest> => {
  const answers = application.answers as DataProtectionComplaint

  return {
    category: 'Kvörtun',
    subject: 'kvörtun frá ísland.is',
    keywords: getAndFormatSubjectsOfComplaint(answers),
    metadata: toRequestMetadata(answers),
    template: 'Kvörtun',
    contacts: gatherContacts(answers),
    documents: attachments,
  }
}

export const toRequestMetadata = (
  answers: DataProtectionComplaint,
): Metadata[] => {
  const onBehalf = extractAnswer<OnBehalf>(answers, 'info.onBehalf')

  const targets = getComplaintTargets(answers)
  const mainTarget = targets[0]

  if (!mainTarget)
    throw new Error('No targets of complaint found on application')

  return [
    {
      name: 'OnBehalf',
      value: onBehalf,
    },
    {
      name: 'OperatesWithinEurope',
      value:
        yesNoValueLabelMapper[mainTarget.operatesWithinEurope].defaultMessage,
    },
    {
      name: 'CountryOfOperation',
      value: mainTarget.countryOfOperation ?? '',
    },
  ]
}

export const transformApplicationToComplaintDto = (
  application: Application,
): ComplaintDto => {
  const answers = application.answers as DataProtectionComplaint
  return {
    applicantInfo: {
      name: 'Applicant',
      nationalId: extractAnswer(application, 'applicant'),
    },
    onBehalf: getAndFormatOnBehalf(application),
    agency: {
      files: [],
      persons: getAgencies(answers),
    },
    contactInfo: getContactInfo(answers),
    targetsOfComplaint: getComplaintTargets(answers),
    complaintCategories: getAndFormatSubjectsOfComplaint(answers),
    attachments: [],
    description: extractAnswer(application.answers, 'complaint.description'),
    applicationPdf: '',
  }
}

export const getContactInfo = (
  answers: DataProtectionComplaint,
): ContactInfo => {
  console.log({ answers })

  const onBehalf = extractAnswer<OnBehalf>(answers, 'info.onBehalf')
  const contact =
    onBehalf === OnBehalf.ORGANIZATION_OR_INSTITUTION
      ? answers.organizationOrInstitution
      : answers.applicant

  return {
    name: contact.name,
    nationalId: contact.nationalId,
    type: '', //person | felag/samt
    address: contact.address,
    email: contact.email ?? '',
    phone: contact.phoneNumber ?? '',
    postalCode: contact.postalCode,
    city: contact.city,
  }
}
