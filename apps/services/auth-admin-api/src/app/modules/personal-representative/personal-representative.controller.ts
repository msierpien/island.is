import {
  PersonalRepresentativeRightType,
  PersonalRepresentativeRightTypeService,
  PersonalRepresentativeScopePermission,
  PersonalRepresentativeScopePermissionDTO,
  PersonalRepresentativeScopePermissionService,
} from '@island.is/auth-api-lib/personal-representative'
import {
  BadRequestException,
  Body,
  Controller,
  UseGuards,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Inject,
  Query,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'
import { AuthAdminScope } from '@island.is/auth/scopes'

const namespace = `${environment.audit.defaultNamespace}/personal-representative`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('personal-representative')
@Controller('backend/personal-representative')
@Audit({ namespace })
export class PersonalRepresentativeController {
  constructor(
    @Inject(PersonalRepresentativeRightTypeService)
    private readonly rightTypesService: PersonalRepresentativeRightTypeService,
    private readonly scopePermissionService: PersonalRepresentativeScopePermissionService,
    private readonly auditService: AuditService,
  ) {}

  @ApiOperation({
    summary: 'Get a list of all permissions for a scope',
  })
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('/permissions')
  @ApiQuery({ name: 'apiScopeName', required: false })
  @ApiOkResponse({ type: [PersonalRepresentativeRightType] })
  @Audit<PersonalRepresentativeRightType[]>({
    resources: (result) => result.map((permission) => permission.id),
  })
  async getScopePermissions(
    @Query('apiScopeName') apiScopeName: string,
  ): Promise<PersonalRepresentativeScopePermission[]> {
    const scopePermissions = this.scopePermissionService.getScopePermissionsAsync(
      apiScopeName,
    )
    return scopePermissions
  }

  @ApiOperation({
    summary: 'Create a scope permission',
  })
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post('/permissions')
  @ApiCreatedResponse({ type: PersonalRepresentativeRightType })
  @Audit<PersonalRepresentativeRightType>({
    resources: (permission) => permission.id,
  })
  async createScopePermission(
    @Body() scopePermission: PersonalRepresentativeScopePermissionDTO,
  ): Promise<PersonalRepresentativeScopePermission | void> {
    return await this.scopePermissionService
      .createScopePermissionAsync(scopePermission)
      .catch((error) => {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new BadRequestException(
            'An entity with this value pair already exists.',
          )
        } else {
          throw error
        }
      })
  }

  @ApiOperation({
    summary: 'Delete a scope permission',
  })
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete('/permissions/:id')
  @ApiOkResponse()
  async deleteScopePermission(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException('Id must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'deleteScopePermission',
        namespace,
        resources: id,
      },
      this.scopePermissionService.deleteScopePermissionAsync(id),
    )
  }

  /** Gets all right types */
  @ApiOperation({
    summary: 'Get a list of all permission types',
  })
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get('/permission-types')
  @ApiOkResponse({ type: PersonalRepresentativeRightType })
  async getAvailablePermissions(): Promise<PersonalRepresentativeRightType[]> {
    const permissionTypes = await this.rightTypesService.getAllAsync()

    if (!permissionTypes) {
      throw new NotFoundException('No permissions found')
    }

    return permissionTypes
  }
}
