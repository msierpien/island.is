import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ApiScopeGroup } from './apiScopeGroup.model'

import { ScopeType } from '@island.is/clients/auth-public-api'

@ObjectType('AuthApiScope')
export class ApiScope {
  @Field(() => ID)
  name!: string

  @Field(() => ScopeType)
  type!: ScopeType

  @Field(() => String)
  displayName!: string

  @Field(() => ApiScopeGroup, { nullable: true })
  group?: typeof ApiScopeGroup | null

  @Field(() => String, { nullable: true })
  description?: string | null
}
