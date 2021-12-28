import { Application } from '@island.is/application/core'
import { Config as DrivingLicenseApiConfig } from '@island.is/api/domains/driving-license'
import { Config as CriminalRecordConfig } from '@island.is/api/domains/criminal-record'
import { PaymentServiceOptions } from '@island.is/clients/payment'
import { Message } from '@island.is/email-service'
import { User } from '@island.is/auth-nest-tools'
import { PaymentScheduleServiceOptions } from '@island.is/clients/payment-schedule'
import {
  PaymentScheduleCharge,
  PaymentScheduleType,
} from '@island.is/api/schema'
import { HealthInsuranceV2Options } from '@island.is/clients/health-insurance-v2'
import { DataProtectionComplaintClientConfig } from '@island.is/clients/data-protection-complaint'

export interface BaseTemplateAPIModuleConfig {
  xRoadBasePathWithEnv: string
  jwtSecret: string
  clientLocationOrigin: string
  emailOptions: {
    useTestAccount: boolean
    useNodemailerApp?: boolean
    options?: {
      region: string
    }
  }
  baseApiUrl: string
  email: {
    sender: string
    address: string
  }
  smsOptions: {
    url: string
    username: string
    password: string
  }
  drivingLicense: DrivingLicenseApiConfig
  criminalRecord: CriminalRecordConfig
  attachmentBucket: string
  presignBucket: string
  paymentOptions: PaymentServiceOptions
  generalPetition: {
    endorsementsApiBasePath: string
  }
  paymentScheduleConfig: PaymentScheduleServiceOptions
  healthInsuranceV2: HealthInsuranceV2Options
  dataProtectionComplaint: DataProtectionComplaintClientConfig
}

export interface TemplateApiModuleActionProps {
  application: Application
  auth: User
}

export interface EmailTemplateGeneratorProps {
  application: Application
  options: {
    clientLocationOrigin: string
    locale: string
    email: { sender: string; address: string }
  }
}

export type AssignmentEmailTemplateGenerator = (
  props: EmailTemplateGeneratorProps,
  assignLink: string,
) => Message

export type EmailTemplateGenerator = (
  props: EmailTemplateGeneratorProps,
) => Message

export type AttachmentEmailTemplateGenerator = (
  props: EmailTemplateGeneratorProps,
  fileContent: string,
  email: string,
) => Message

export type PublicDebtPaymentPlanPayment = {
  id: PublicDebtPaymentScheduleType
  totalAmount: number
  distribution: string
  amountPerMonth: number
  numberOfMonths: number
  organization: string
  chargetypes: PaymentScheduleCharge[]
}

export type PublicDebtPaymentPlanPaymentCollection = {
  [key: string]: PublicDebtPaymentPlanPayment
}

export type PublicDebtPaymentPlanPrerequisites = {
  type: PublicDebtPaymentScheduleType
  organizationId: string
  chargetypes: {
    id: string
    name: string
    total: number
    intrest: number
    expenses: number
    principal: number
  }[]
}

export enum PublicDebtPaymentScheduleType {
  FinesAndLegalCost = 'FinesAndLegalCost',
  OverpaidBenefits = 'OverpaidBenefits',
  Wagedection = 'Wagedection',
  OtherFees = 'OtherFees',
}
