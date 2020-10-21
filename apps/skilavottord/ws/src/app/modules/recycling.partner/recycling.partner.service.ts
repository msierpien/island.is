import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { RecyclingPartnerModel } from './model/recycling.partner.model'

@Injectable()
export class RecyclingPartnerService {
  constructor(
    @InjectModel(RecyclingPartnerModel)
    private recyclingPartnerModel: typeof RecyclingPartnerModel,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async findByCompanyId(companyId: string): Promise<RecyclingPartnerModel> {
    this.logger.debug(
      `Finding recycling partner for companyId - "${companyId}"`,
    )
    return this.recyclingPartnerModel.findOne({
      where: { companyId },
    })
  }

  async findAll(): Promise<RecyclingPartnerModel[]> {
    const res = await this.recyclingPartnerModel.findAll()
    this.logger.debug(
      'findAll-recyclingPartners result:' + JSON.stringify(res, null, 2),
    )
    return res
  }

  async create(
    recyclingPartner: RecyclingPartnerModel,
  ): Promise<RecyclingPartnerModel> {
    this.logger.debug(
      `Creating recycling partner with nationalId - ${recyclingPartner.companyId}`,
    )
    return this.recyclingPartnerModel.create(recyclingPartner)
  }
}
