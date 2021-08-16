import { Field, ObjectType } from '@nestjs/graphql'

import { StaffRoles, User } from '@island.is/financial-aid/shared'

@ObjectType()
export class UserModel implements User {
  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field()
  readonly phoneNumber!: string

  @Field()
  readonly folder!: string

  @Field()
  readonly service!: 'osk' | 'veita'

  @Field()
  readonly hasAppliedForPeriod?: boolean

  @Field()
  readonly municipalityId?: 'hfj'

  @Field(() => String)
  readonly role?: StaffRoles
}
