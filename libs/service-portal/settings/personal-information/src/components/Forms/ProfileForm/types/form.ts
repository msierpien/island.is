import { FieldValues, UseFormMethods } from 'react-hook-form/dist/types/form'

export interface FormValues {
  email?: string
  tel?: string
  bankInfo?: string
  canNudge?: boolean
}

export type DropModalType = 'tel' | 'mail' | 'all' | undefined
export type DataLoadingType = 'EMAIL' | 'TEL' | 'BANKINFO' | 'NUDGE' | undefined

export type HookFormType = UseFormMethods<FieldValues & FormValues>
