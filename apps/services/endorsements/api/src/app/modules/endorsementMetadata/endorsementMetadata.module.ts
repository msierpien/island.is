import { Module } from '@nestjs/common'
import fetch from 'isomorphic-fetch'
import { EndorsementMetadataService } from './endorsementMetadata.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { NationalRegistryUserService } from './providers/nationalRegistry/nationalRegistry.service'
import { environment } from '../../../environments'
import { SequelizeModule } from '@nestjs/sequelize'
import { Endorsement } from '../endorsement/models/endorsement.model'
import { EndorsementSystemSignedListsService } from './providers/endorsementSystem/endorsementSystemSignedLists.service'
import {
  Configuration,
  TemporaryVoterRegistryApi,
} from './providers/temporaryVoterRegistry/gen/fetch'
import { TemporaryVoterRegistryService } from './providers/temporaryVoterRegistry/temporaryVoterRegistry.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Endorsement]),
    NationalRegistryClientModule,
  ],
  providers: [
    NationalRegistryUserService,
    EndorsementSystemSignedListsService,
    EndorsementMetadataService,
    TemporaryVoterRegistryService,
    {
      provide: TemporaryVoterRegistryApi,
      useFactory: async () =>
        new TemporaryVoterRegistryApi(
          new Configuration({
            fetchApi: fetch,
            basePath: environment.metadataProvider.temporaryVoterRegistry
              .baseApiUrl as string,
          }),
        ),
    },
  ],
  exports: [EndorsementMetadataService],
})
export class EndorsementMetadataModule {}
