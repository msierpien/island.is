import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOAuth2,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiExtraModels,
  ApiOperation,
  IntersectionType,
} from '@nestjs/swagger'
import { Audit } from '@island.is/nest/audit'
import { EndorsementList } from './endorsementList.model'
import { EndorsementListService } from './endorsementList.service'
import { EndorsementListDto } from './dto/endorsementList.dto'
import { FindEndorsementListByTagsDto } from './dto/findEndorsementListsByTags.dto'
import { ChangeEndorsmentListClosedDateDto } from './dto/changeEndorsmentListClosedDate.dto'
import { UpdateEndorsementListDto } from './dto/updateEndorsementList.dto'
import { BypassAuth, CurrentUser, Scopes } from '@island.is/auth-nest-tools'
import { EndorsementListByIdPipe } from './pipes/endorsementListById.pipe'
import { environment } from '../../../environments'
import { GenericScope } from '@island.is/auth/scopes'
import { HasAccessGroup } from '../../guards/accessGuard/access.decorator'
import { AccessGroup } from '../../guards/accessGuard/access.enum'
import type { User } from '@island.is/auth-nest-tools'

import { PaginationDto } from '@island.is/nest/pagination'
import { PaginatedEndorsementListDto } from './dto/paginatedEndorsementList.dto'
import { PaginatedEndorsementDto } from '../endorsement/dto/paginatedEndorsement.dto'
import { SearchQueryDto } from './dto/searchQuery.dto'
import { EndorsementListInterceptor } from './interceptors/endorsementList.interceptor'
import { EndorsementListsInterceptor } from './interceptors/endorsementLists.interceptor'

export class FindTagPaginationComboDto extends IntersectionType(
  FindEndorsementListByTagsDto,
  PaginationDto,
) {}

export class SearchPaginationComboDto extends IntersectionType(
  SearchQueryDto,
  PaginationDto,
) {}

@Audit({
  namespace: `${environment.audit.defaultNamespace}/endorsement-list`,
})
@ApiTags('endorsementList')
@Controller('endorsement-list')
@ApiOAuth2([])
@ApiExtraModels(FindTagPaginationComboDto, PaginatedEndorsementListDto)
export class EndorsementListController {
  constructor(
    private readonly endorsementListService: EndorsementListService,
  ) {}

  @ApiOperation({
    summary:
      'Finds all endorsement lists belonging to given tags, if user is not admin then no locked lists will appear',
  })
  @ApiOkResponse({ type: PaginatedEndorsementListDto })
  @Get()
  @UseInterceptors(EndorsementListsInterceptor)
  @Scopes(GenericScope.internal)
  async findByTags(
    @CurrentUser() user: User,
    @Query() query: FindTagPaginationComboDto,
  ): Promise<PaginatedEndorsementListDto> {
    return await this.endorsementListService.findListsByTags(
      // query parameters of length one are not arrays, we normalize all tags input to arrays here
      !Array.isArray(query.tags) ? [query.tags] : query.tags,
      query,
      user.nationalId,
    )
  }

  // get gp lists - relay
  @ApiOperation({ summary: 'Gets General Petition Lists' })
  @ApiOkResponse({ type: PaginatedEndorsementListDto })
  @Get('general-petition-lists')
  @UseInterceptors(EndorsementListsInterceptor)
  @BypassAuth()
  async getGeneralPetitionLists(
    @Query() query: PaginationDto,
  ): Promise<PaginatedEndorsementListDto> {
    return await this.endorsementListService.findOpenListsTaggedGeneralPetition(
      query,
    )
  }

  // get gp list  - relay
  @ApiOperation({ summary: 'Gets a General Petition List by Id' })
  @ApiOkResponse({ type: EndorsementList })
  @ApiParam({ name: 'listId', type: 'string' })
  @Get('general-petition-list/:listId')
  @UseInterceptors(EndorsementListInterceptor)
  @BypassAuth()
  async getGeneralPetitionList(
    @Param('listId') listId: string,
  ): Promise<EndorsementList | null> {
    return await this.endorsementListService.findSingleOpenListTaggedGeneralPetition(
      listId,
    )
  }

  @Scopes(GenericScope.internal)
  @ApiOperation({
    summary: 'Finds all endorsements for the currently authenticated user',
  })
  @ApiOkResponse({ type: PaginatedEndorsementDto })
  @Get('/endorsements')
  @Audit<PaginatedEndorsementDto>({
    resources: ({ data: endorsement }) => endorsement.map((e) => e.id),
    meta: ({ data: endorsement }) => ({ count: endorsement.length }),
  })
  async findEndorsements(
    @CurrentUser() user: User,
    @Query() query: PaginationDto,
  ): Promise<PaginatedEndorsementDto> {
    return await this.endorsementListService.findAllEndorsementsByNationalId(
      user.nationalId,
      query,
    )
  }

  @ApiOperation({
    summary:
      'Finds all endorsement lists owned by the currently authenticated user',
  })
  @ApiOkResponse({ type: PaginatedEndorsementListDto })
  @Get('/endorsementLists')
  @UseInterceptors(EndorsementListsInterceptor)
  @Audit<PaginatedEndorsementListDto>({
    resources: ({ data: endorsement }) => endorsement.map((e) => e.id),
    meta: ({ data: endorsement }) => ({ count: endorsement.length }),
  })
  async findEndorsementLists(
    @CurrentUser() user: User,
    @Query() query: PaginationDto,
  ): Promise<PaginatedEndorsementListDto> {
    return await this.endorsementListService.findAllEndorsementListsByNationalId(
      user.nationalId,
      query,
    )
  }

  @ApiOkResponse({
    description: 'Finds a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiOperation({ summary: 'Finds a single endorsements list by id' })
  @ApiParam({ name: 'listId', type: 'string' })
  @Scopes(GenericScope.internal)
  @Get(':listId')
  @UseInterceptors(EndorsementListInterceptor)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
  async findOne(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return endorsementList
  }

  @ApiOperation({ summary: 'Close a single endorsements list by id' })
  @ApiOkResponse({
    description: 'Close a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @Scopes(GenericScope.system, GenericScope.internal)
  @Put(':listId/close')
  @UseInterceptors(EndorsementListInterceptor)
  @HasAccessGroup(AccessGroup.Owner)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
  async close(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.close(endorsementList)
  }

  @ApiOperation({ summary: 'Open a single endorsements list by id' })
  @ApiOkResponse({
    description: 'Open a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @ApiBody({ type: ChangeEndorsmentListClosedDateDto })
  @Scopes(GenericScope.internal)
  @Put(':listId/open')
  @UseInterceptors(EndorsementListInterceptor)
  @HasAccessGroup(AccessGroup.Owner)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
  async open(
    @Body() newDate: ChangeEndorsmentListClosedDateDto,
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.open(endorsementList, newDate)
  }

  @ApiOkResponse({
    description: 'Lock a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @Scopes(GenericScope.internal)
  @Put(':listId/lock')
  @UseInterceptors(EndorsementListInterceptor)
  @HasAccessGroup(AccessGroup.Admin)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
  async lock(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.lock(endorsementList)
  }

  @ApiOkResponse({
    description: 'Unlock a single endorsements list by id',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @Scopes(GenericScope.internal)
  @Put(':listId/unlock')
  @UseInterceptors(EndorsementListInterceptor)
  @HasAccessGroup(AccessGroup.Admin)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
  async unlock(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.unlock(endorsementList)
  }

  @ApiOkResponse({
    description:
      'Admin update a single endorsements list by id and request body',
    type: EndorsementList,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @ApiBody({ type: UpdateEndorsementListDto })
  @Scopes(GenericScope.internal)
  @Put(':listId/update')
  @HasAccessGroup(AccessGroup.Admin)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
  })
  async update(
    @Body() newData: UpdateEndorsementListDto,
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.updateEndorsementList(
      endorsementList,
      newData,
    )
  }

  @ApiOperation({ summary: 'Create an endorsements list' })
  @ApiOkResponse({
    description: 'Create an endorsements list',
    type: EndorsementList,
  })
  @ApiBody({ type: EndorsementListDto })
  @Scopes(GenericScope.system, GenericScope.internal)
  @Post()
  @UseInterceptors(EndorsementListInterceptor)
  @Audit<EndorsementList>({
    resources: (endorsementList) => endorsementList.id,
    meta: (endorsementList) => ({
      tags: endorsementList.tags,
    }),
  })
  async create(
    @Body() endorsementList: EndorsementListDto,
    @CurrentUser() user: User,
  ): Promise<EndorsementList> {
    return await this.endorsementListService.create({
      ...endorsementList,
      owner: user.nationalId,
    })
  }

  @ApiOperation({ summary: 'Fetches owner info from national registry' })
  @ApiOkResponse({
    description: 'Create an endorsements list',
    type: String,
  })
  @ApiParam({ name: 'listId', type: 'string' })
  @BypassAuth()
  @Get(':listId/ownerInfo')
  async getOwnerInfo(
    @Param(
      'listId',
      new ParseUUIDPipe({ version: '4' }),
      EndorsementListByIdPipe,
    )
    endorsementList: EndorsementList,
  ): Promise<String> {
    return await this.endorsementListService.getOwnerInfo(endorsementList)
  }
}
