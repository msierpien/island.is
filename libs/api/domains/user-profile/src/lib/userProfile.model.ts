import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  nationalId?: string

  @Field(() => String, { nullable: true })
  mobilePhoneNumber?: string

  @Field(() => String, { nullable: true })
  locale?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => Boolean)
  emailVerified!: boolean

  @Field(() => Boolean)
  mobilePhoneNumberVerified!: boolean

  @Field(() => Boolean)
  documentNotifications!: boolean
}
