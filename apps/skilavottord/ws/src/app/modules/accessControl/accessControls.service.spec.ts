import { Test, TestingModule } from '@nestjs/testing'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SequelizeModule } from '@nestjs/sequelize'
import { AccessControlService } from './accessControl.service'
import { AccessControlModel } from './accessControl.model'
import { Role } from '../auth'
import { RecyclingPartnerModel } from '../recyclingPartner/recyclingPartner.model'
import { RecyclingRequestModel } from '../recyclingRequest'
import {
  DeleteAccessControlInput,
  UpdateAccessControlInput,
} from './accessControl.input'

describe('accessControlService', () => {
  let accessControlService: AccessControlService
  let moduleRef: TestingModule

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forFeature([
          AccessControlModel,
          RecyclingPartnerModel,
          RecyclingRequestModel,
        ]),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'dev_db',
          password: 'dev_db',
          database: 'dev_db',
          autoLoadModels: true,
          synchronize: true,
        }),
      ],
      providers: [
        AccessControlService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile()
    accessControlService = moduleRef.get(AccessControlService)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  describe('testAccessControl', () => {
    it('get all access users', async () => {
      try {
        const accessUsers = await accessControlService.findAll()
        logger.debug('' + JSON.stringify(accessUsers, null, 2))
        expect(true).toEqual(true)
      } catch (err) {
        expect(false).toEqual(true)
        logger.error(err)
      }
    })
    it('create access user', async () => {
      try {
        const input = new UpdateAccessControlInput()
        input.nationalId = '1111111111'
        input.name = 'Jónas Jónasson'
        input.role = Role.developer
        input.partnerId = '8888888888'
        const accessUser = await accessControlService.createAccess(input)
        logger.debug(
          'success access user created : ' +
            JSON.stringify(accessUser, null, 2),
        )
        expect(true).toEqual(true)
      } catch (err) {
        expect(false).toEqual(true)
        logger.error(err)
      }
    })
    it('update one access user', async () => {
      try {
        const input = new UpdateAccessControlInput()
        input.nationalId = '1111111111'
        input.name = 'Jón Jónsson'
        input.role = Role.recyclingFund
        const accessUser = await accessControlService.updateAccess(input)
        logger.debug(
          'uppfærður access user: ' + JSON.stringify(accessUser, null, 2),
        )
        expect(true).toEqual(true)
      } catch (err) {
        expect(false).toEqual(true)
        logger.error(err)
      }
    })
    it('remove user access', async () => {
      const input = new DeleteAccessControlInput()
      try {
        input.nationalId = '1111111111'
        const isDeleted = await accessControlService.deleteAccess(input)
        if (isDeleted) {
          logger.debug('SUCCESS removing user access:')
          expect(isDeleted).toEqual(true)
        } else {
          logger.debug('ERROR removing user access:')
          expect(isDeleted).toEqual(true)
        }
      } catch (err) {
        logger.error(err)
      }
    })
  })
})
