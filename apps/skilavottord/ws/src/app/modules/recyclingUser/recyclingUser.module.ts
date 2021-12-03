import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingUserModel } from './recyclingUser.model'

@Module({})
export class RecyclingUserModule {}


@Module({
  imports: [SequelizeModule.forFeature([RecyclingUserModel])],
  providers: [],
  exports: [],
})
export class RecyclingPartnerModule {}
