import { Application, getValueViaPath } from '@island.is/application/core'
import {
  accidentLocationLabelMapper,
  AccidentNotificationAnswers,
  AccidentTypeEnum,
  FishermanWorkplaceAccidentShipLocationEnum,
  StudiesAccidentTypeEnum,
  SubmittedApplicationData,
  WhoIsTheNotificationForEnum,
  WorkAccidentTypeEnum,
  utils,
} from '@island.is/application/templates/accident-notification'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'
import {
  additionalFilesRequest,
  allAttachmentRequestConfig,
  injuryCertificateRequest,
  policeReportRequest,
  powerOfAttorneyRequest,
} from './config'
import { AccidentNotificationAttachmentStatus } from './types/applicationStatus'
import {
  ApplicationSubmit,
  Atvinnurekandi,
  Slys,
  TilkynnandiOrSlasadi,
} from './types/applicationSubmit'
import {
  AccidentNotificationAttachment,
  AccidentNotificationAttachmentGatherRequest,
} from './types/attachments'

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/accident-notification/emailGenerators/assets/${file}`,
    )
  }

  return join(__dirname, `./accident-notification-assets/${file}`)
}

/**
 * Generates Xml correctly formatted for each type of SÍ application
 * The order of the elements is important as an incorrect order
 * will result in an Invalid Xml error from SÍ
 * @param answers - The answers to the accident notification
 * @param attachments - The attachments names and base64 Content
 * @returns The application Xml correctly formatted for SÍ application
 */
export const applictionAnswersToXml = (
  answers: AccidentNotificationAnswers,
  attachments: AccidentNotificationAttachment[],
): string => {
  const fylgiskjol = {
    fylgiskjol: {
      fylgiskjal: attachments.map((attachment) => {
        return {
          heiti: attachment.name,
          tegund: attachment.attachmentType as number,
          innihald: attachment.content,
        }
      }),
    },
  }

  const applicationJson: ApplicationSubmit = {
    slysatilkynning: {
      tilkynnandi: {
        kennitala: answers.applicant.nationalId,
        nafn: answers.applicant.name,
        heimili: answers.applicant.address,
        stadur: answers.applicant.city,
        postfang: answers.applicant.postalCode,
        netfang: answers.applicant.email,
        fyrirhvernerveridadtilkynna: whoIsTheNotificationForToId(
          answers.whoIsTheNotificationFor.answer,
        ),
        simi: answers.applicant.phoneNumber,
      },
      slasadi: injuredPerson(answers),
      slys: accident(answers),
      atvinnurekandi: employer(answers),
      ...fylgiskjol,
    },
  }

  const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>${objectToXML(
    applicationJson,
  )}`

  return xml
}

export const whiteListedErrorCodes = [
  's801_fyrirt_kennit',
  's801_undirtegund',
  's801_tilkynnandi',
  's801_teg_tilk',
  's801_stads_skipa',
  's801_sly_timislys',
  's801_sly_tegund',
  's801_sly_dags',
  's801_fylgiskjal',
  's801_slasadi',
]

const whoIsTheNotificationForToId = (
  value: WhoIsTheNotificationForEnum,
): number => {
  switch (value) {
    case WhoIsTheNotificationForEnum.ME:
      return 1
    case WhoIsTheNotificationForEnum.POWEROFATTORNEY:
      return 2
    case WhoIsTheNotificationForEnum.JURIDICALPERSON:
      return 3
    case WhoIsTheNotificationForEnum.CHILDINCUSTODY:
      return 4
  }
}

const injuredPerson = (
  answers: AccidentNotificationAnswers,
): TilkynnandiOrSlasadi => {
  if (
    answers.whoIsTheNotificationFor.answer ===
    WhoIsTheNotificationForEnum.CHILDINCUSTODY
  ) {
    return {
      kennitala: answers.childInCustody.nationalId,
      nafn: answers.childInCustody.name,
      netfang: ' ', //the child has no email,
    }
  }
  const person =
    answers.whoIsTheNotificationFor.answer === WhoIsTheNotificationForEnum.ME
      ? answers.applicant
      : answers.injuredPersonInformation
  return {
    kennitala: person.nationalId,
    nafn: person.name,
    netfang: person.email,
    simi: person.phoneNumber,
  }
}

const accident = (answers: AccidentNotificationAnswers): Slys => {
  const accidentType = accidentTypeToId(answers.accidentType.radioButton)
  const accidentBase = {
    tegund: accidentType,
    undirtegund: determineSubType(answers),
    dagsetningslys: answers.accidentDetails.dateOfAccident,
    timislys: answers.accidentDetails.timeOfAccident,
    lysing: answers.accidentDetails.descriptionOfAccident,
    banaslys: yesOrNoToNumber(answers.wasTheAccidentFatal),
    bilslys: yesOrNoToNumber(answers.carAccidentHindrance),
    stadurslysseferindi: answers.locationAndPurpose?.location ?? '',
    lysingerindis: answers.accidentLocation
      ? accidentLocationLabelMapper[
          answers.accidentLocation
            .answer as keyof typeof accidentLocationLabelMapper
        ]
      : '',
  }

  switch (answers.accidentType.radioButton) {
    case AccidentTypeEnum.HOMEACTIVITIES: {
      return {
        ...accidentBase,
        slysvidheimilisstorf: {
          heimili: answers.homeAccident.address,
          postnumer: answers.homeAccident.postalCode,
          sveitarfelag: answers.homeAccident.community,
          nanar: answers.homeAccident.moreDetails,
        },
      }
    }
    case AccidentTypeEnum.SPORTS:
      return accidentBase
    case AccidentTypeEnum.RESCUEWORK:
      return accidentBase
    case AccidentTypeEnum.STUDIES:
      return accidentBase
    case AccidentTypeEnum.WORK: {
      return work(answers, accidentBase)
    }
  }
}

const work = (
  answers: AccidentNotificationAnswers,
  accidentBase: Slys,
): Slys => {
  if (answers.workAccident.type === WorkAccidentTypeEnum.FISHERMAN) {
    return {
      ...accidentBase,
      slysvidvinnusjomanna: {
        stadsetningskips: shipLocation(answers),
        nafnskips: answers.fishingShipInfo.shipName,
        einkennisstafirskips: answers.fishingShipInfo.shipCharacters,
      },
    }
  }

  return answers.workMachineRadio === 'yes'
    ? {
        ...accidentBase,
        slysvidvinnu: {
          lysingavinnuvel: answers.workMachine.desriptionOfMachine,
        },
      }
    : accidentBase
}

const shipLocation = (answers: AccidentNotificationAnswers): number => {
  const location = answers.shipLocation
    .answer as FishermanWorkplaceAccidentShipLocationEnum
  switch (location) {
    case FishermanWorkplaceAccidentShipLocationEnum.SAILINGORFISHING:
      return 1
    case FishermanWorkplaceAccidentShipLocationEnum.HARBOR:
      return 2
    case FishermanWorkplaceAccidentShipLocationEnum.OTHER:
      return 3
  }
}

const employer = (
  answers: AccidentNotificationAnswers,
): Atvinnurekandi | undefined => {
  const companyInfo = answers.companyInfo
  const representative = answers.representative

  // If the juridical person is reporting the company info is the juridical persons information
  if (
    answers.juridicalPerson &&
    answers.applicant &&
    utils.isRepresentativeOfCompanyOrInstitute(answers)
  ) {
    return {
      fyrirtaekikennitala: answers.juridicalPerson.companyNationalId,
      fyrirtaekinafn: answers.juridicalPerson.companyName,
      forsjaradilinafn: answers.applicant.name,
      forsjaradilinetfang: answers.applicant.email,
      forsjaradilisimi: answers.applicant.phoneNumber || '',
    }
  }

  if (
    answers.accidentType.radioButton === AccidentTypeEnum.HOMEACTIVITIES ||
    !companyInfo ||
    !representative
  ) {
    return undefined
  }

  return {
    fyrirtaekikennitala: companyInfo.nationalRegistrationId,
    fyrirtaekinafn: companyInfo.name,
    forsjaradilinafn: representative.name,
    forsjaradilinetfang: representative.email,
    forsjaradilisimi: representative.phoneNumber || '',
  }
}

const yesOrNoToNumber = (value: string): number => {
  return value === 'yes' ? 1 : 0
}

const accidentTypeToId = (typeEnum: AccidentTypeEnum): number => {
  switch (typeEnum) {
    case AccidentTypeEnum.HOMEACTIVITIES:
      return 7
    case AccidentTypeEnum.SPORTS:
      return 4
    case AccidentTypeEnum.RESCUEWORK:
      return 8
    case AccidentTypeEnum.STUDIES:
      return 9
    case AccidentTypeEnum.WORK:
      return 6
  }
}

const determineSubType = (
  answers: AccidentNotificationAnswers,
): number | undefined => {
  if (answers.accidentType.radioButton === AccidentTypeEnum.WORK) {
    switch (answers.workAccident.type) {
      case WorkAccidentTypeEnum.GENERAL:
        return 1
      case WorkAccidentTypeEnum.FISHERMAN:
        return 2
      case WorkAccidentTypeEnum.PROFESSIONALATHLETE:
        return 3
      case WorkAccidentTypeEnum.AGRICULTURE:
        return 4
      default:
        return undefined
    }
  }
  if (answers.accidentType.radioButton === AccidentTypeEnum.STUDIES) {
    switch (answers.studiesAccident.type) {
      case StudiesAccidentTypeEnum.INTERNSHIP:
        return 5
      case StudiesAccidentTypeEnum.VOCATIONALEDUCATION:
        return 6
      case StudiesAccidentTypeEnum.APPRENTICESHIP:
        return 7
      default:
        return undefined
    }
  }
  return undefined
}

export const objectToXML = (obj: object) => {
  let xml = ''
  Object.entries(obj).forEach((entry) => {
    const [key, value] = entry
    if (value === undefined) {
      return
    }
    xml += value instanceof Array ? '' : '<' + key + '>'
    if (value instanceof Array) {
      for (const i in value) {
        xml += '<' + key + '>'
        xml += objectToXML(value[i])
        xml += '</' + key + '>'
      }
    } else if (typeof value == 'object') {
      xml += objectToXML(new Object(value))
    } else {
      xml += value
    }
    xml += value instanceof Array ? '' : '</' + key + '>'
  })
  return xml
}

export const getApplicationDocumentId = (application: Application): number => {
  const subAppData = application.externalData
    .submitApplication as SubmittedApplicationData
  const documentId = subAppData?.data?.documentId
  if (!documentId) {
    throw new Error('No documentId found on application')
  }
  return documentId
}

export const attachmentStatusToAttachmentRequests = (
  receivedAttachments?: AccidentNotificationAttachmentStatus,
): AccidentNotificationAttachmentGatherRequest[] => {
  if (!receivedAttachments) return allAttachmentRequestConfig.requests

  const attachmentRequests: AccidentNotificationAttachmentGatherRequest[] = []

  if (
    !receivedAttachments.InjuryCertificate &&
    receivedAttachments.InjuryCertificate != null
  ) {
    attachmentRequests.push(injuryCertificateRequest)
  }
  if (
    !receivedAttachments.ProxyDocument &&
    receivedAttachments.ProxyDocument != null
  ) {
    attachmentRequests.push(powerOfAttorneyRequest)
  }
  if (
    !receivedAttachments.PoliceReport &&
    receivedAttachments.PoliceReport != null
  ) {
    attachmentRequests.push(policeReportRequest)
  }
  if (!receivedAttachments.Unknown && receivedAttachments.Unknown != null) {
    attachmentRequests.push(additionalFilesRequest)
  }

  return attachmentRequests
}

export const getApplicationAttachmentStatus = (
  application: Application,
): AccidentNotificationAttachmentStatus => {
  const status = getValueViaPath(
    application.answers,
    'accidentStatus.recievedAttachments',
  ) as AccidentNotificationAttachmentStatus

  return status
}
