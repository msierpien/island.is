import { Context, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Inject, UseGuards } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { User } from '@island.is/financial-aid/shared/lib'

import { UserModel } from './user.model'

import { StaffModel } from '../staff/models'
import { CurrentUser } from '../decorators'
import { BackendAPI } from '../../../services'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async handleNotFoundException<T>(callback: () => Promise<T>) {
    try {
      return await callback()
    } catch (e) {
      if (e.extensions.response.status === 404) {
        return undefined
      }
      throw e
    }
  }

  @Query(() => UserModel, { nullable: true })
  async currentUser(@CurrentUser() user: User): Promise<UserModel | undefined> {
    this.logger.debug('Getting current user')
    return user as UserModel
  }

  @ResolveField('isSpouse', () => Boolean)
  async isSpouse(
    @Parent() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<Boolean> {
    const isSpouse = await backendApi.isSpouse(user.nationalId)
    return isSpouse.HasApplied
  }

  @ResolveField('currentApplication', () => String)
  async currentApplication(
    @Parent() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<string | undefined> {
    this.logger.debug('Getting current application for nationalId')
    return await this.handleNotFoundException(() =>
      backendApi.getCurrentApplication(user.nationalId),
    )
  }

  @ResolveField('staff', () => StaffModel, { name: 'staff', nullable: true })
  async staff(
    @Parent() user: User,
    @Context('dataSources') { backendApi }: { backendApi: BackendAPI },
  ): Promise<StaffModel | undefined> {
    this.logger.debug('Getting staff for nationalId')
    return await backendApi.getStaff(user.nationalId)
  }
}
