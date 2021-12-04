import { Test, TestingModule } from '@nestjs/testing'
import { RecyclingUserService } from './recyclingUser.service'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SequelizeModule } from '@nestjs/sequelize'
import { RecyclingUserModel } from './recyclingUser.model'

describe('skilavottordUserService', () => {
  let recyclingUserServie: RecyclingUserService
  let recyclingUserModel: RecyclingUserModel
  let moduleRef: TestingModule

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        SequelizeModule.forFeature([RecyclingUserModel]),
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
        RecyclingUserService,
        {
          provide: LOGGER_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile()
    recyclingUserServie = moduleRef.get(RecyclingUserService)
  })

  afterEach(async () => {
    await moduleRef.close()
  })

  describe('testRecyclingService', () => {
    it('get all recycling users', async () => {
      let res = await recyclingUserServie.findAll()
      expect(true).toEqual(true)
    })
  })
})
