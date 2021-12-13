import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { ExecutionContext, UseGuards } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { AuthGuard } from '@nestjs/passport'

import { Role, AuthUser } from './auth.types'
import { AuthService } from './auth.service'

type AuthorizeOptions = {
  throwOnUnAuthorized?: boolean
  roles?: Role[]
}

// Can't use the Dependency Injection since GraphQLAuthGuard needs to
// be passed dynamic parameters. So creating a shared instance
// will have to do.
const authService = new AuthService()

class GraphQLAuthGuard extends AuthGuard('jwt') {
  options: AuthorizeOptions

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()
    return super.canActivate(new ExecutionContextHost([req]))
  }

  handleRequest<TUser extends AuthUser>(err: Error, user: TUser): TUser {
    const { throwOnUnAuthorized, roles } = this.options

    if (throwOnUnAuthorized && (err || !user)) {
      throw new AuthenticationError((err && err.message) || 'Unauthorized')
    } else if (
      roles &&
      !roles.find((role) => authService.checkRole(user, role))
    ) {
      throw new ForbiddenError('Forbidden')
    }

    return user
  }
}

export const Authorize = (
  { throwOnUnAuthorized = true, roles }: AuthorizeOptions = {
    throwOnUnAuthorized: true,
    roles: [],
  },
): MethodDecorator & ClassDecorator => {
  return UseGuards(new GraphQLAuthGuard({ throwOnUnAuthorized, roles }))
}
