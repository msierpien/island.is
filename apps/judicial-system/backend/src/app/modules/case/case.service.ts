import { Includeable } from 'sequelize/types'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { FormatMessage, IntlService } from '@island.is/cms-translations'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  DokobitError,
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { EmailService } from '@island.is/email-service'
import { IntegratedCourts } from '@island.is/judicial-system/consts'
import {
  isRestrictionCase,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User as TUser } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'
import {
  getRequestPdfAsBuffer,
  getRequestPdfAsString,
  getRulingPdfAsString,
  getCasefilesPdfAsString,
  writeFile,
  getCustodyNoticePdfAsString,
} from '../../formatters'
import { notificationMessages as m } from '../../messages'
import { FileService } from '../file/file.service'
import { Institution } from '../institution'
import { User, UserService } from '../user'
import { AwsS3Service } from '../aws-s3'
import { CourtService } from '../court'
import { CreateCaseDto, InternalCreateCaseDto, UpdateCaseDto } from './dto'
import { getCasesQueryFilter } from './filters'
import { Case, SignatureConfirmationResponse } from './models'

interface Recipient {
  name: string
  address: string
}

const standardIncludes: Includeable[] = [
  {
    model: Institution,
    as: 'court',
  },
  {
    model: User,
    as: 'creatingProsecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'prosecutor',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Institution, as: 'sharedWithProsecutorsOffice' },
  {
    model: User,
    as: 'judge',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'registrar',
    include: [{ model: Institution, as: 'institution' }],
  },
  {
    model: User,
    as: 'courtRecordSignatory',
    include: [{ model: Institution, as: 'institution' }],
  },
  { model: Case, as: 'parentCase' },
  { model: Case, as: 'childCase' },
]

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case)
    private readonly caseModel: typeof Case,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly awsS3Service: AwsS3Service,
    private readonly courtService: CourtService,
    private readonly signingService: SigningService,
    private readonly emailService: EmailService,
    private readonly intlService: IntlService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async uploadSignedRulingPdfToS3(
    existingCase: Case,
    pdf: string,
  ): Promise<boolean> {
    return this.awsS3Service
      .putObject(`generated/${existingCase.id}/ruling.pdf`, pdf)
      .then(() => true)
      .catch(() => {
        this.logger.error(
          `Failed to upload signed ruling pdf to AWS S3 for case ${existingCase.id}`,
        )

        return false
      })
  }

  private async uploadSignedRulingPdfToCourt(
    existingCase: Case,
    pdf: string,
  ): Promise<boolean> {
    // TODO: Find a better place for this
    try {
      existingCase.caseFiles = await this.fileService.getAllCaseFiles(
        existingCase.id,
      )

      if (existingCase.caseFiles && existingCase.caseFiles.length > 0) {
        this.logger.debug(
          `Uploading case files overview pdf to court for case ${existingCase.id}`,
        )

        const caseFilesPdf = await getCasefilesPdfAsString(existingCase)

        if (!environment.production) {
          writeFile(`${existingCase.id}-case-files.pdf`, caseFilesPdf)
        }

        const buffer = Buffer.from(caseFilesPdf, 'binary')

        const streamId = await this.courtService.uploadStream(
          existingCase.courtId,
          'Rannsóknargögn.pdf',
          'application/pdf',
          buffer,
        )
        await this.courtService.createDocument(
          existingCase.courtId,
          existingCase.courtCaseNumber,
          'Rannsóknargögn',
          'Rannsóknargögn.pdf',
          streamId,
        )
      }
    } catch (error) {
      // Log and ignore this error. The overview is not that critical.
      this.logger.error(
        `Failed to upload case files overview pdf to court for case ${existingCase.id}`,
        error,
      )
    }

    this.logger.debug(
      `Uploading signed ruling pdf to court for case ${existingCase.id}`,
    )

    const buffer = Buffer.from(pdf, 'binary')

    try {
      const streamId = await this.courtService.uploadStream(
        existingCase.courtId,
        'Þingbók og úrskurður.pdf',
        'application/pdf',
        buffer,
      )
      await this.courtService.createThingbok(
        existingCase.courtId,
        existingCase.courtCaseNumber,
        streamId,
      )

      return true
    } catch (error) {
      this.logger.error(
        `Failed to upload signed ruling pdf to court for case ${existingCase.id}`,
        error,
      )

      return false
    }
  }

  private async sendEmail(
    to: Recipient | Recipient[],
    body: string,
    formatMessage: FormatMessage,
    courtCaseNumber?: string,
    signedRulingPdf?: string,
  ) {
    try {
      await this.emailService.sendEmail({
        from: {
          name: environment.email.fromName,
          address: environment.email.fromEmail,
        },
        replyTo: {
          name: environment.email.replyToName,
          address: environment.email.replyToEmail,
        },
        to,
        subject: formatMessage(m.signedRuling.subject, {
          courtCaseNumber,
        }),
        text: body,
        html: body,
        attachments: signedRulingPdf
          ? [
              {
                filename: formatMessage(m.signedRuling.attachment, {
                  courtCaseNumber,
                }),
                content: signedRulingPdf,
                encoding: 'binary',
              },
            ]
          : undefined,
      })
    } catch (error) {
      this.logger.error('Failed to send email', error)
    }
  }

  private async sendRulingAsSignedPdf(
    existingCase: Case,
    signedRulingPdf: string,
  ): Promise<void> {
    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    if (!environment.production) {
      writeFile(`${existingCase.id}-ruling-signed.pdf`, signedRulingPdf)
    }

    let uploadedToS3 = false
    let uploadedToCourt = false

    const uploadPromises = [
      this.uploadSignedRulingPdfToS3(existingCase, signedRulingPdf).then(
        (res) => {
          uploadedToS3 = res
        },
      ),
    ]

    if (
      existingCase.courtId &&
      existingCase.courtCaseNumber &&
      IntegratedCourts.includes(existingCase.courtId)
    ) {
      uploadPromises.push(
        this.uploadSignedRulingPdfToCourt(existingCase, signedRulingPdf).then(
          (res) => {
            uploadedToCourt = res
          },
        ),
      )
    }

    await Promise.all(uploadPromises)

    const emailPromises = [
      this.sendEmail(
        {
          name: existingCase.prosecutor?.name ?? '',
          address: existingCase.prosecutor?.email ?? '',
        },
        uploadedToS3
          ? intl.formatMessage(m.signedRuling.prosecutorBodyS3, {
              courtCaseNumber: existingCase.courtCaseNumber,
              courtName: existingCase.court?.name?.replace('dómur', 'dómi'),
            })
          : intl.formatMessage(m.signedRuling.prosecutorBodyAttachment, {
              courtName: existingCase.court?.name,
              courtCaseNumber: existingCase.courtCaseNumber,
            }),
        intl.formatMessage,
        existingCase.courtCaseNumber,
        uploadedToS3 ? undefined : signedRulingPdf,
      ),
    ]

    if (!uploadedToCourt) {
      emailPromises.push(
        this.sendEmail(
          [
            {
              name: existingCase.registrar?.name ?? '',
              address: existingCase.registrar?.email ?? '',
            },
            {
              name: existingCase.judge?.name ?? '',
              address: existingCase.judge?.email ?? '',
            },
          ],
          intl.formatMessage(m.signedRuling.courtBodyAttachment),
          intl.formatMessage,
          existingCase.courtCaseNumber,
          signedRulingPdf,
        ),
      )
    }

    if (
      existingCase.defenderEmail &&
      (isRestrictionCase(existingCase.type) ||
        existingCase.sessionArrangements === SessionArrangements.ALL_PRESENT ||
        (existingCase.sessionArrangements ===
          SessionArrangements.ALL_PRESENT_SPOKESPERSON &&
          existingCase.defenderIsSpokesperson))
    ) {
      emailPromises.push(
        this.sendEmail(
          {
            name: existingCase.defenderName ?? '',
            address: existingCase.defenderEmail,
          },
          intl.formatMessage(m.signedRuling.defenderBodyAttachment, {
            courtName: existingCase.court?.name,
            courtCaseNumber: existingCase.courtCaseNumber,
          }),
          intl.formatMessage,
          existingCase.courtCaseNumber,
          signedRulingPdf,
        ),
      )
    }

    await Promise.all(emailPromises)
  }

  async findById(
    id: string,
    additionalIncludes: Includeable[] = [],
  ): Promise<Case | null> {
    this.logger.debug(`Finding case ${id}`)

    const include = standardIncludes.concat(additionalIncludes)

    return this.caseModel.findOne({
      where: { id },
      include,
    })
  }

  async findOriginalAncestor(theCase: Case): Promise<Case> {
    let originalAncestor: Case = theCase

    while (originalAncestor.parentCaseId) {
      const parentCase = await this.caseModel.findOne({
        where: { id: originalAncestor.parentCaseId },
      })

      if (!parentCase) {
        throw new InternalServerErrorException(
          `Original ancestor of case ${theCase.id} not found`,
        )
      }

      originalAncestor = parentCase
    }

    return originalAncestor
  }

  async getAll(user: TUser): Promise<Case[]> {
    this.logger.debug('Getting all cases')

    return this.caseModel.findAll({
      order: [['created', 'DESC']],
      where: getCasesQueryFilter(user),
      include: standardIncludes,
    })
  }

  async internalCreate(caseToCreate: InternalCreateCaseDto): Promise<Case> {
    this.logger.debug('Creating a new case')

    if (!caseToCreate.prosecutorNationalId) {
      return this.create(caseToCreate)
    }

    const prosecutor = await this.userService.findByNationalId(
      caseToCreate.prosecutorNationalId,
    )

    if (!prosecutor || prosecutor.role !== UserRole.PROSECUTOR) {
      throw new BadRequestException(
        `Person with national id ${caseToCreate.prosecutorNationalId} is not registered as a prosecutor`,
      )
    }

    return this.create(caseToCreate, prosecutor.id)
  }

  async create(
    caseToCreate: CreateCaseDto,
    prosecutorId?: string,
  ): Promise<Case> {
    this.logger.debug('Creating a new case')

    return this.caseModel.create({
      ...caseToCreate,
      creatingProsecutorId: prosecutorId,
      prosecutorId,
    })
  }

  async update(
    id: string,
    update: UpdateCaseDto,
  ): Promise<{ numberOfAffectedRows: number; updatedCase: Case }> {
    this.logger.debug(`Updating case ${id}`)

    const [numberOfAffectedRows, [updatedCase]] = await this.caseModel.update(
      update,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedCase }
  }

  async getRequestPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the request for case ${existingCase.id} as a pdf document`,
    )

    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    return getRequestPdfAsString(existingCase, intl.formatMessage)
  }

  async getCourtRecordPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the court record for case ${existingCase.id} as a pdf document`,
    )

    const pdf = await this.awsS3Service
      .getObject(`generated/${existingCase.id}/courtRecord.pdf`)
      .then((res) => res.toString('binary'))
      .catch(() => undefined)

    if (pdf) {
      return pdf
    }

    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    return getRulingPdfAsString(existingCase, intl.formatMessage, true)
  }

  async getRulingPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the ruling for case ${existingCase.id} as a pdf document`,
    )

    const pdf = await this.awsS3Service
      .getObject(`generated/${existingCase.id}/ruling.pdf`)
      .then((res) => res.toString('binary'))
      .catch(() => undefined)

    if (pdf) {
      return pdf
    }

    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    return getRulingPdfAsString(existingCase, intl.formatMessage, false)
  }

  async getCustodyPdf(existingCase: Case): Promise<string> {
    this.logger.debug(
      `Getting the custody notice for case ${existingCase.id} as a pdf document`,
    )

    return getCustodyNoticePdfAsString(existingCase)
  }

  async requestCourtRecordSignature(
    existingCase: Case,
    user: TUser,
  ): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of court record for case ${existingCase.id}`,
    )

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      const intl = await this.intlService.useIntl(
        ['judicial.system.backend'],
        'is',
      )

      const pdf = await getRulingPdfAsString(
        existingCase,
        intl.formatMessage,
        true,
      )

      return this.signingService.requestSignature(
        user.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        user.name ?? '',
        'Ísland',
        'courtRecord.pdf',
        pdf,
      )
    }

    // Development without signing service access token
    return {
      controlCode: '0000',
      documentToken: 'DEVELOPMENT',
    }
  }

  async getCourtRecordSignatureConfirmation(
    existingCase: Case,
    user: TUser,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    this.logger.debug(
      `Confirming signature of court record for case ${existingCase.id}`,
    )

    // This method should be called immediately after requestCourtRecordSignature

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      try {
        const courtRecordPdf = await this.signingService.getSignedDocument(
          'courtRecord.pdf',
          documentToken,
        )

        this.awsS3Service
          .putObject(
            `generated/${existingCase.id}/courtRecord.pdf`,
            courtRecordPdf,
          )
          .catch(() => {
            // Tolerate failure
            this.logger.error(
              `Failed to upload signed court record pdf to AWS S3 for case ${existingCase.id}`,
            )
          })
      } catch (error) {
        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      }
    }

    // TODO: UpdateCaseDto does not contain courtRecordSignatoryId and courtRecordSignatureDate - create a new type for CaseService.update
    await this.update(existingCase.id, {
      courtRecordSignatoryId: user.id,
      courtRecordSignatureDate: new Date(),
    } as UpdateCaseDto)

    return {
      documentSigned: true,
    }
  }

  async requestRulingSignature(
    existingCase: Case,
  ): Promise<SigningServiceResponse> {
    this.logger.debug(
      `Requesting signature of ruling for case ${existingCase.id}`,
    )

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      const intl = await this.intlService.useIntl(
        ['judicial.system.backend'],
        'is',
      )

      const pdf = await getRulingPdfAsString(
        existingCase,
        intl.formatMessage,
        false,
      )

      return this.signingService.requestSignature(
        existingCase.judge?.mobileNumber ?? '',
        'Undirrita skjal - Öryggistala',
        existingCase.judge?.name ?? '',
        'Ísland',
        'ruling.pdf',
        pdf,
      )
    }

    // Development without signing service access token
    return {
      controlCode: '0000',
      documentToken: 'DEVELOPMENT',
    }
  }

  async getRulingSignatureConfirmation(
    existingCase: Case,
    documentToken: string,
  ): Promise<SignatureConfirmationResponse> {
    this.logger.debug(
      `Confirming signature of ruling for case ${existingCase.id}`,
    )

    // This method should be called immediately after requestRulingSignature

    // Production, or development with signing service access token
    if (environment.production || environment.signingOptions.accessToken) {
      try {
        const signedPdf = await this.signingService.getSignedDocument(
          'ruling.pdf',
          documentToken,
        )

        await this.sendRulingAsSignedPdf(existingCase, signedPdf)
      } catch (error) {
        if (error instanceof DokobitError) {
          return {
            documentSigned: false,
            code: error.code,
            message: error.message,
          }
        }

        throw error
      }
    }

    // TODO: UpdateCaseDto does not contain rulingDate - create a new type for CaseService.update
    await this.update(existingCase.id, {
      rulingDate: new Date(),
    } as UpdateCaseDto)

    return {
      documentSigned: true,
    }
  }

  async extend(existingCase: Case, user: TUser): Promise<Case> {
    this.logger.debug(`Extending case ${existingCase.id}`)

    return this.caseModel.create({
      type: existingCase.type,
      policeCaseNumber: existingCase.policeCaseNumber,
      description: existingCase.description,
      accusedNationalId: existingCase.accusedNationalId,
      accusedName: existingCase.accusedName,
      accusedAddress: existingCase.accusedAddress,
      accusedGender: existingCase.accusedGender,
      defenderName: existingCase.defenderName,
      defenderEmail: existingCase.defenderEmail,
      defenderPhoneNumber: existingCase.defenderPhoneNumber,
      leadInvestigator: existingCase.leadInvestigator,
      courtId: existingCase.courtId,
      translator: existingCase.translator,
      lawsBroken: existingCase.lawsBroken,
      legalBasis: existingCase.legalBasis,
      legalProvisions: existingCase.legalProvisions,
      requestedCustodyRestrictions: existingCase.requestedCustodyRestrictions,
      caseFacts: existingCase.caseFacts,
      legalArguments: existingCase.legalArguments,
      requestProsecutorOnlySession: existingCase.requestProsecutorOnlySession,
      prosecutorOnlySessionRequest: existingCase.prosecutorOnlySessionRequest,
      creatingProsecutorId: user.id,
      prosecutorId: user.id,
      parentCaseId: existingCase.id,
      initialRulingDate:
        existingCase.initialRulingDate ?? existingCase.rulingDate,
    })
  }

  async uploadRequestPdfToCourt(id: string): Promise<void> {
    this.logger.debug(`Uploading request pdf to court for case ${id}`)

    const existingCase = (await this.findById(id)) as Case

    const intl = await this.intlService.useIntl(
      ['judicial.system.backend'],
      'is',
    )

    const pdf = await getRequestPdfAsBuffer(existingCase, intl.formatMessage)

    try {
      const streamId = await this.courtService.uploadStream(
        existingCase.courtId,
        'Krafa.pdf',
        'application/pdf',
        pdf,
      )
      await this.courtService.createRequest(
        existingCase.courtId,
        existingCase.courtCaseNumber,
        'Krafa',
        'Krafa.pdf',
        streamId,
      )
    } catch (error) {
      this.logger.error(
        `Failed to upload request pdf to court for case ${id}`,
        error,
      )
    }
  }
}
