export enum PersonType {
  Plaintiff,
  CounterParty,
  Child,
  CriminalRecordApplicant,
}

export type Person = {
  name: string
  ssn: string
  phoneNumber?: string
  email?: string
  homeAddress: string
  postalCode: string
  city: string
  signed: boolean
  type: PersonType
}

export type Attachment = {
  name: string
  content: string
}

export interface DataUploadResponse {
  skilabod: string
  audkenni: string
  malsnumer: string
}

export interface SealedCriminalRecordResponse {
  audkenni: string
  skilabod: string
  skjal: string
}
