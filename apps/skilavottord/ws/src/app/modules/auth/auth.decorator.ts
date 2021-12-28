import { createParamDecorator } from '@nestjs/common'

import { AuthUser } from './auth.types'

export const CurrentUser = createParamDecorator(
  (data, { args: [_1, _2, { req }] }): AuthUser => req.user,
)
