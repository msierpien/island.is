import {
  CreateStaffMunicipality,
  Staff,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { UpdateStaffDto, CreateStaffDto } from './dto'
import { Op } from 'sequelize'
import { Transaction } from 'sequelize/types'
import { environment } from '../../../environments'

import { StaffModel } from './models'
import { EmailService } from '@island.is/email-service'
import { logger } from '@island.is/logging'
import {
  EmployeeEmailTemplate,
  AdminEmailTemplate,
  AdminAndEmployeeEmailTemplate,
} from '../application/emailTemplates'

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(StaffModel)
    private readonly staffModel: typeof StaffModel,
    private readonly emailService: EmailService,
  ) {}

  async findByNationalId(nationalId: string): Promise<StaffModel> {
    return await this.staffModel.findOne({
      where: {
        nationalId,
      },
    })
  }

  async findById(id: string): Promise<StaffModel> {
    return await this.staffModel.findOne({
      where: {
        id,
      },
    })
  }

  async findByMunicipalityId(municipalityId: string): Promise<StaffModel[]> {
    return await this.staffModel.findAll({
      where: {
        municipalityId,
      },
      order: Sequelize.literal(
        'CASE WHEN active = true THEN 0 ELSE 1 END, name ASC',
      ),
    })
  }

  async update(
    id: string,
    update: UpdateStaffDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedStaff: StaffModel
  }> {
    const [numberOfAffectedRows, [updatedStaff]] = await this.staffModel.update(
      update,
      {
        where: { id },
        returning: true,
      },
    )

    return { numberOfAffectedRows, updatedStaff }
  }

  private async sendEmail(
    input: CreateStaffDto,
    municipalityName: string,
    user: Staff,
    isFirstStaffForMunicipality: boolean,
  ) {
    const contact = {
      from: {
        name: 'Samband íslenskra sveitarfélaga',
        address: environment.emailOptions.fromEmail,
      },
      replyTo: {
        name: 'Samband íslenskra sveitarfélaga',
        address: environment.emailOptions.replyToEmail,
      },
      to: input.email,
    }

    try {
      if (
        input.roles.includes(StaffRole.EMPLOYEE) &&
        input.roles.includes(StaffRole.ADMIN)
      ) {
        await this.emailService.sendEmail({
          ...contact,
          subject: 'Vinnsluaðili og stjórnandi í vinnslukerfi fjárhagsaðstoðar',
          html: AdminAndEmployeeEmailTemplate(
            municipalityName,
            environment.veitaBaseUrl,
            input.email,
            isFirstStaffForMunicipality,
          ),
        })
      } else if (input.roles.includes(StaffRole.EMPLOYEE)) {
        await this.emailService.sendEmail({
          ...contact,
          subject: 'Vinnsluaðili í vinnslukerfi fjárhagsaðstoðar',
          html: EmployeeEmailTemplate(
            municipalityName,
            environment.veitaBaseUrl,
            input.email,
          ),
        })
      } else if (input.roles.includes(StaffRole.ADMIN)) {
        await this.emailService.sendEmail({
          ...contact,
          subject: 'Stjórnandi í vinnslukerfi fjárhagsaðstoðar',
          html: AdminEmailTemplate(
            environment.veitaBaseUrl,
            input.email,
            isFirstStaffForMunicipality,
          ),
        })
      }
    } catch (error) {
      logger.warn('failed to send email', error)
    }
  }

  async createStaff(
    input: CreateStaffDto,
    municipality: CreateStaffMunicipality,
    user: Staff,
    t?: Transaction,
    isFirstStaffForMunicipality: boolean = false,
  ): Promise<StaffModel> {
    await this.sendEmail(
      input,
      municipality.municipalityName,
      user,
      isFirstStaffForMunicipality,
    )
    return await this.staffModel.create(
      {
        nationalId: input.nationalId,
        name: input.name,
        municipalityId: municipality.municipalityId,
        email: input.email,
        roles: input.roles,
        active: true,
        municipalityName: municipality.municipalityName,
        municipalityHomepage: municipality.municipalityHomepage,
      },
      { transaction: t },
    )
  }

  async numberOfUsersForMunicipality(municipalityId: string): Promise<number> {
    return await this.staffModel.count({
      where: {
        municipalityId,
      },
    })
  }

  async getUsers(municipalityId: string): Promise<StaffModel[]> {
    return await this.staffModel.findAll({
      where: {
        municipalityId,
        roles: { [Op.contains]: [StaffRole.ADMIN] },
      },
    })
  }

  async getSupervisors(): Promise<StaffModel[]> {
    return await this.staffModel.findAll({
      where: {
        roles: { [Op.contains]: [StaffRole.SUPERADMIN] },
      },
    })
  }
}
