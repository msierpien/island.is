import {
  HomeCircumstances,
  ApplicationState,
  FileType,
  Employment,
  ApplicationEventType,
  RolesRule,
  StaffRole,
  ApplicationStateUrl,
  FamilyStatus,
  AidType,
} from './enums'

export interface GetSignedUrl {
  fileName: string
}

export interface SignedUrl {
  url: string
  key: string
}

export interface CreateFilesResponse {
  success: boolean
}

export interface Staff {
  id: string
  nationalId: string
  name: string
  municipalityId: string
  roles: StaffRole[]
  active: boolean
  municipalityName: string
  phoneNumber?: string
  municipalityHomepage?: string
  nickname?: string
  email?: string
  usePseudoName?: boolean
}

export interface UpdateStaff {
  name?: string
  nationalId?: string
  roles?: StaffRole[]
  active?: boolean
  nickname?: string
  email?: string
  usePseudoName?: boolean
}

export interface Aid {
  ownPlace: number
  registeredRenting: number
  unregisteredRenting: number
  livesWithParents: number
  unknown: number
  withOthers: number
  municipalityId: string
  type: AidType
}

export interface Amount {
  applicationId?: string
  aidAmount: number
  income?: number
  personalTaxCredit: number
  spousePersonalTaxCredit?: number
  tax: number
  finalAmount: number
  deductionFactors?: DeductionFactors[]
}

export interface DeductionFactors {
  amount?: number
  description?: string
}

export interface NavigationProps {
  activeSectionIndex: number
  activeSubSectionIndex?: number
  prevUrl: string | undefined
  nextUrl: string | undefined
}

export interface FormSpouse {
  nationalId?: string
  name?: string
  email?: string
}

export interface User {
  nationalId: string
  name: string
  phoneNumber?: string
  folder: string
  service: RolesRule
  currentApplicationId?: string
  spouse?: Spouse
  staff?: Staff
  formSpouse?: FormSpouse
  address?: Address
}

export interface Address {
  streetName: string
  postalCode: string
  city: string
  municipalityCode: string
}

export interface UpdateApplication {
  state?: ApplicationState
  event: ApplicationEventType
  rejection?: string
  comment?: string
  staffId?: string
  spousePhoneNumber?: string
  spouseEmail?: string
  spouseName?: string
  spouseFormComment?: string
  amount?: Amount
}

export interface UpdateApplicationTable {
  state: ApplicationState
  staffId: string
  stateUrl: ApplicationStateUrl
  event: ApplicationEventType
}

export interface CreateApplicationEvent {
  applicationId: string
  eventType: ApplicationEventType
  comment?: string
}

export interface ApplicationEvent {
  id: string
  created: string
  applicationId: string
  eventType: ApplicationEventType
  comment?: string
  staffNationalId?: string
  staffName?: string
}

export interface Municipality {
  id: string
  name: string
  active: boolean
  municipalityId: string
  individualAid: Aid
  cohabitationAid: Aid
  homepage?: string
  email?: string
  rulesHomepage?: string
  numberOfUsers?: number
  adminUsers?: Staff[]
}

export interface UpdateMunicipalityActivity {
  active: boolean
}

export interface CreateMunicipality {
  name: string
  municipalityId: string
}

export interface ApplicationFile {
  id: string
  created: string
  applicationId: string
  name: string
  key: string
  size: number
  type: FileType
}

export interface CreateApplicationFile {
  name: string
  key: string
  size: number
  type: FileType
}

export interface CreateApplication {
  nationalId: string
  name: string
  phoneNumber?: string
  email: string
  homeCircumstances: HomeCircumstances
  student: boolean
  employment: Employment
  hasIncome: boolean
  usePersonalTaxCredit: boolean
  bankNumber?: string
  ledger?: string
  accountNumber?: string
  interview?: boolean
  employmentCustom?: string
  homeCircumstancesCustom?: string
  studentCustom?: string
  formComment?: string
  state?: ApplicationState
  files: CreateApplicationFile[]
  amount?: number
  spouseNationalId?: string
  spouseEmail?: string
  spouseName?: string
  familyStatus: FamilyStatus
  streetName?: string
  postalCode?: string
  city?: string
  municipalityCode?: string
}

export interface ApplicantEmailData {
  header: string
  content: string
  title: string
  applicationChange: string
  applicationMonth: string
  applicationYear: number
  applicationLink: string
  applicantEmail: string
  municipality: Municipality
}

export interface ApplicationFilters {
  New: number
  InProgress: number
  DataNeeded: number
  Rejected: number
  Approved: number
  MyCases: number
}

export interface Application {
  id: string
  created: string
  modified: string
  nationalId: string
  name: string
  phoneNumber?: string
  email: string
  homeCircumstances: HomeCircumstances
  student: boolean
  employment: Employment
  hasIncome: boolean
  usePersonalTaxCredit: boolean
  bankNumber?: string
  ledger?: string
  accountNumber?: string
  interview?: boolean
  employmentCustom?: string
  homeCircumstancesCustom?: string
  studentCustom?: string
  formComment?: string
  spouseFormComment?: string
  state: ApplicationState
  files?: ApplicationFile[]
  comment?: string
  rejection?: string
  staff?: Staff
  applicationEvents?: ApplicationEvent[]
  amount?: Amount
  spouseNationalId?: string
  spouseEmail?: string
  spousePhoneNumber?: string
  spouseName?: string
  familyStatus: FamilyStatus
  streetName?: string
  postalCode?: string
  city?: string
  municipalityCode?: string
}

export interface GetSignedUrlForId {
  id: string
}

export interface Spouse {
  hasPartnerApplied: boolean
  hasFiles: boolean
  spouseName?: string
}

export interface UpdateApplicationTableResponseType {
  applications: Application[]
  filters: ApplicationFilters
}

export interface UpdateApplicationResponseType {
  application: Application
  filters?: ApplicationFilters
}

export interface NationalRegistryData {
  nationalId: string
  fullName: string
  address: {
    streetName: string
    postalCode: string
    city: string
    municipalityCode: string
  }
  spouse?: {
    nationalId?: string
    maritalStatus?: string
    name?: string
  }
}

export interface ServiceCenter {
  name: string
  number: number
  phone: string
  address: string
  addressPostalCode: string
  postalCodes: number[]
  active?: boolean
  link?: string
}

export interface TableHeadersProps {
  filterBy?: string
  title: string
}

export interface CreateStaff {
  name: string
  email: string
  nationalId: string
  roles: StaffRole[]
  municipalityName?: string
  municipalityId?: string
}

export interface CreateStaffMunicipality {
  municipalityId: string
  municipalityName: string
  municipalityHomepage?: string
}
