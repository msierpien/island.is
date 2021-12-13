import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Staff, StaffRole } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class StaffModel implements Staff {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly name!: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly municipalityId!: string

  @Field()
  readonly municipalityName!: string

  @Field(() => [String])
  readonly roles!: StaffRole[]

  @Field()
  readonly active!: boolean

  @Field({ nullable: true })
  readonly usePseudoName?: boolean

  @Field({ nullable: true })
  readonly phoneNumber?: string

  @Field()
  readonly municipalityHomepage?: string

  @Field({ nullable: true })
  readonly nickname?: string

  @Field({ nullable: true })
  readonly email?: string
}
