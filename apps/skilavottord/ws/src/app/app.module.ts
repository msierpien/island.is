import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { SequelizeModule } from '@nestjs/sequelize'

import { BASE_PATH } from '@island.is/skilavottord/consts'

import {
  UserModule,
  AuthModule,
  GdprModule,
  VehicleModule,
  RecyclingRequestModule,
  RecyclingPartnerModule,
  VehicleOwnerModule,
  SamgongustofaModule,
  FjarsyslaModule,
} from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { environment } from '../environments'
import { RecyclingUserModule } from './modules/recyclingUser/recyclingUser.module';

const debug = process.env.NODE_ENV === 'development'
const playground = debug || process.env.GQL_PLAYGROUND_ENABLED === 'true'
const autoSchemaFile = environment.production
  ? true
  : 'apps/skilavottord/ws/src/app/api.graphql'

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug,
      playground,
      autoSchemaFile,
      path: `${BASE_PATH}/api/graphql`,
    }),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    RecyclingRequestModule,
    AuthModule,
    UserModule,
    SamgongustofaModule,
    FjarsyslaModule,
    GdprModule,
    RecyclingPartnerModule,
    VehicleModule,
    VehicleOwnerModule,
    RecyclingUserModule,
  ],
})
export class AppModule {}
