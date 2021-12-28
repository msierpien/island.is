import { InjectModel } from '@nestjs/sequelize'
import { Injectable } from '@nestjs/common'
import { Op } from 'sequelize'

import { RecyclingPartnerModel } from '../recyclingPartner'
import { Role } from '../auth'

import { AccessControlModel } from './accessControl.model'
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
  ) {}

  async findAll(isDeveloper: boolean): Promise<AccessControlModel[]> {
    return this.accessControlModel.findAll({
      where: isDeveloper ? {} : { role: { [Op.not]: Role.developer } },
      include: [
        {
          model: RecyclingPartnerModel,
        },
      ],
    })
  }

  async findOne(nationalId: string): Promise<AccessControlModel> {
    return this.accessControlModel.findOne({
      where: { nationalId },
      include: [
        {
          model: RecyclingPartnerModel,
        },
      ],
      raw: true,
    })
  }

  async createAccess(
    input: CreateAccessControlInput,
  ): Promise<AccessControlModel> {
    return this.accessControlModel.create(input)
  }

  async updateAccess({
    nationalId,
    ...input
  }: UpdateAccessControlInput): Promise<AccessControlModel> {
    const [_, [accessControl]] = await this.accessControlModel.update(input, {
      where: { nationalId },
      returning: true,
    })
    return accessControl
  }

  async deleteAccess({
    nationalId,
  }: DeleteAccessControlInput): Promise<Boolean> {
    const affectedRows = await this.accessControlModel.destroy({
      where: { nationalId },
    })
    return affectedRows === 1
  }
}
