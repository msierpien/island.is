import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { RecyclingUserModel } from './recyclingUser.model'

@Injectable()
export class RecyclingUserService {
  constructor(
    @InjectModel(RecyclingUserModel)
    private recyclingUserModel: typeof RecyclingUserModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  /*
   *
   */
  async findAll(): Promise<RecyclingUserModel[]> {
    this.logger.info('find all recyclingUsers...')
    try {
      const res = await this.recyclingUserModel.findAll()
      this.logger.info(
        'findAll-recyclingUsers result:' + JSON.stringify(res, null, 2),
      )
      return res
    } catch (error) {
      this.logger.error('error finding all recyclingUsers:' + error)
    }
  }
}
