import { AccessControlModel } from './accessControl.model'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { InjectModel } from '@nestjs/sequelize'
import {
  CreateAccessControlInput,
  DeleteAccessControlInput,
  UpdateAccessControlInput,
} from './accessControl.input'

@Injectable()
export class AccessControlService {
  constructor(
    @InjectModel(AccessControlModel)
    private accessControlModel: typeof AccessControlModel,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  async findAll(): Promise<AccessControlModel[]> {
    this.logger.info('---- Starting findAll Access Controls ----')
    const accesControlUsers = await AccessControlModel.findAll()
    // const accesControlUsers = await AccessControlModel.findAll({
    //   include: [
    //     {
    //       model: RecyclingPartnerModel,
    //     },
    //   ],
    // })
    this.logger.info(
      'findAll-AccessControl user result:' +
        JSON.stringify(accesControlUsers, null, 2),
    )
    return accesControlUsers
  }

  async findOne(nationalId: string): Promise<AccessControlModel> {
    this.logger.info('find one access user...')
    // return await this.accessControlModel.findOne()
    return await this.accessControlModel.findOne({
      where: { nationalId: nationalId },
      // include: [
      //   {
      //     model: RecyclingPartnerModel,
      //   },
      // ],
    })
  }

  async createAccess(
    input: CreateAccessControlInput,
  ): Promise<AccessControlModel> {
    this.logger.info('Creating Access:' + JSON.stringify(input, null, 2))
    const accessUser = new AccessControlModel()
    accessUser.nationalId = input.nationalId
    accessUser.name = input.name
    accessUser.partnerId = input.partnerId
    accessUser.role = input.role
    return await accessUser.save()
  }

  async updateAccess(
    input: UpdateAccessControlInput,
  ): Promise<AccessControlModel> {
    const accessUser = await this.findOne(input.nationalId)
    accessUser.partnerId = input.partnerId
    accessUser.role = input.role
    accessUser.name = input.name
    accessUser.save()
    return accessUser
  }

  async deleteAccess(input: DeleteAccessControlInput): Promise<Boolean> {
    const accessUser = await this.findOne(input.nationalId)
    if (accessUser) {
      accessUser.destroy()
      return true
    }
    return false
  }
}

// async createAccess(
//   input: CreateAccessControlInput,
// ): Promise<AccessControlModel> {
//   // TODO replace mock data with actual db query
//   return Promise.resolve({
//     nationalId: '1234567890',
//     name: 'Gervimaður3',
//     role: Role.recyclingCompany,
//     partnerId: '9999999999',
//   })
// }

// async updateAccess(
//   input: UpdateAccessControlInput,
// ): Promise<AccessControlModel> {
//   // TODO replace mock data with actual db query
//   return Promise.resolve({
//     nationalId: '1234567890',
//     name: 'Gervimaður3',
//     role: Role.recyclingCompany,
//     partnerId: '9999999999',
//   })
// }
