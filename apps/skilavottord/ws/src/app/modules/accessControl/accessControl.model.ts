import { Field, ObjectType, ID } from '@nestjs/graphql'

import { Role } from '../auth'

@ObjectType('AccessControl')
export class AccessControlModel {
  @Field((_) => ID)
  nationalId!: string

  @Field()
  name!: string

  @Field(() => Role)
  role!: Role

  // TODO: get from samgongustofa
  @Field()
  partnerId!: string
}
