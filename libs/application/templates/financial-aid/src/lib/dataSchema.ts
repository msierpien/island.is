import { error } from './messages/index'
import * as z from 'zod'
import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { isValidEmail, isValidNationalId, isValidPhone } from './utils'
import { ApproveOptions } from './types'

export const dataSchema = z.object({
  // approveExternalData: z.boolean().refine((v) => v, {
  //   params: error.validation.dataGathering,
  // }),
  spouse: z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: error.validation.email,
    }),
    approveTerms: z.array(z.string()).refine((v) => v && v.length === 1, {
      params: error.validation.approveSpouse,
    }),
  }),
  relationshipStatus: z
    .object({
      unregisteredCohabitation: z
        .enum([ApproveOptions.Yes, ApproveOptions.No])
        .refine((v) => v, {
          params: error.validation.radioErrorMessage,
        }),
      spouse: z
        .object({
          email: z.string().refine((v) => isValidEmail(v), {
            params: error.validation.email,
          }),
          nationalId: z.string().refine((v) => isValidNationalId(v), {
            params: error.validation.nationlId,
          }),
          approveTerms: z.array(z.string()).refine((v) => v && v.length === 1, {
            params: error.validation.approveSpouse,
          }),
        })
        .optional(),
    })
    .refine(
      (v) =>
        v.unregisteredCohabitation === ApproveOptions.Yes ? v.spouse : true,
      {
        params: error.validation.inputErrorMessage,
        // path: ['spouse.email'],
      },
    ),
  student: z
    .object({
      isStudent: z
        .enum([ApproveOptions.Yes, ApproveOptions.No])
        .refine((v) => v, {
          params: error.validation.radioErrorMessage,
        }),
      custom: z.string().optional(),
    })
    .refine((v) => (v.isStudent === ApproveOptions.Yes ? v.custom : true), {
      params: error.validation.inputErrorMessage,
    }),
  homeCircumstances: z
    .object({
      type: z
        .enum([
          HomeCircumstances.WITHPARENTS,
          HomeCircumstances.WITHOTHERS,
          HomeCircumstances.OWNPLACE,
          HomeCircumstances.REGISTEREDLEASE,
          HomeCircumstances.UNREGISTEREDLEASE,
          HomeCircumstances.OTHER,
        ])
        .refine((v) => v, {
          params: error.validation.radioErrorMessage,
        }),
      custom: z.string().optional(),
    })
    .refine((v) => (v.type === HomeCircumstances.OTHER ? v.custom : true), {
      params: error.validation.inputErrorMessage,
      path: ['custom'],
    }),
  income: z.enum([ApproveOptions.Yes, ApproveOptions.No]).refine((v) => v, {
    params: error.validation.radioErrorMessage,
  }),
  employment: z
    .object({
      type: z
        .enum([
          Employment.WORKING,
          Employment.UNEMPLOYED,
          Employment.CANNOTWORK,
          Employment.OTHER,
        ])
        .refine((v) => v, {
          params: error.validation.radioErrorMessage,
        }),
      custom: z.string().optional(),
    })
    .refine((v) => (v.type === Employment.OTHER ? v.custom : true), {
      params: error.validation.inputErrorMessage,
      path: ['custom'],
    }),
  bankInfoForm: z.object({
    bankNumber: z.string().optional(),
    ledger: z.string().optional(),
    accountNumber: z.string().optional(),
  }),
  personalTaxCreditForm: z
    .enum([ApproveOptions.Yes, ApproveOptions.No])
    .refine((v) => v, {
      params: error.validation.radioErrorMessage,
    }),
  formComment: z.string().optional(),
  contactInfo: z.object({
    email: z.string().refine((v) => isValidEmail(v), {
      params: error.validation.email,
    }),
    phone: z.string().refine((v) => isValidPhone(v), {
      params: error.validation.phone,
    }),
  }),
})

export type answersSchema = z.infer<typeof dataSchema>
