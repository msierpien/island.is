import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccessControlService } from './accessControl.service'
import { AccessControlModel } from './accessControl.model'
import { AccessControlResolver } from './accessControl.resolver'

@Module({
  imports: [SequelizeModule.forFeature([AccessControlModel])],
  providers: [AccessControlService, AccessControlResolver],
  exports: [AccessControlResolver, AccessControlService],
})
export class AccessControlModule {}
