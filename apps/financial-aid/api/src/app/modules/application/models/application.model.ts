import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  Application,
  HomeCircumstances,
  Employment,
  ApplicationState,
  FamilyStatus,
} from '@island.is/financial-aid/shared/lib'

import { ApplicationFileModel } from '../../file'
import { StaffModel } from '../../staff'
import { ApplicationEventModel, ApplicationFiltersModel } from './index'
import { AmountModel } from '../../amount'

@ObjectType()
export class ApplicationModel implements Application {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field({ nullable: true })
  readonly phoneNumber?: string

  @Field()
  readonly email!: string

  @Field(() => String)
  readonly homeCircumstances!: HomeCircumstances

  @Field({ nullable: true })
  readonly homeCircumstancesCustom?: string

  @Field()
  readonly student!: boolean

  @Field({ nullable: true })
  readonly studentCustom?: string

  @Field(() => String)
  readonly employment!: Employment

  @Field({ nullable: true })
  readonly employmentCustom?: string

  @Field()
  readonly hasIncome!: boolean

  @Field()
  readonly usePersonalTaxCredit!: boolean

  @Field({ nullable: true })
  readonly bankNumber?: string

  @Field({ nullable: true })
  readonly ledger?: string

  @Field({ nullable: true })
  readonly accountNumber?: string

  @Field({ nullable: true })
  readonly interview?: boolean

  @Field({ nullable: true })
  readonly formComment?: string

  @Field({ nullable: true })
  readonly spouseFormComment?: string

  @Field(() => String)
  readonly state!: ApplicationState

  @Field(() => [ApplicationFileModel], { nullable: true })
  readonly files?: ApplicationFileModel[]

  @Field({ nullable: true })
  readonly rejection?: string

  @Field({ nullable: true })
  readonly staff?: StaffModel

  @Field(() => [ApplicationEventModel], { nullable: true })
  readonly applicationEvents?: ApplicationEventModel[]

  @Field({ nullable: true })
  readonly amount?: AmountModel

  @Field(() => ApplicationFiltersModel, { nullable: true })
  readonly filters?: ApplicationFiltersModel

  @Field({ nullable: true })
  readonly spouseName?: string

  @Field({ nullable: true })
  readonly spouseNationalId?: string

  @Field({ nullable: true })
  readonly spouseEmail?: string

  @Field({ nullable: true })
  readonly spousePhoneNumber?: string

  @Field(() => String)
  readonly familyStatus!: FamilyStatus

  @Field({ nullable: true })
  readonly streetName?: string

  @Field({ nullable: true })
  readonly postalCode?: string

  @Field({ nullable: true })
  readonly city?: string

  @Field({ nullable: true })
  readonly municipalityCode?: string
}
