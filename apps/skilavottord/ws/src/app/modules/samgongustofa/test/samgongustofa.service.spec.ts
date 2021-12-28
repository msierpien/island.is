import { AxiosResponse } from 'axios'
import { of } from 'rxjs'
import { Test } from '@nestjs/testing'
import { HttpModule, HttpService } from '@nestjs/common'

import { logger, LOGGER_PROVIDER } from '@island.is/logging'

import {
  RecyclingRequestService,
  RecyclingRequestModel,
} from '../../recyclingRequest'

import { SamgongustofaService } from '../samgongustofa.service'
import { MockData } from './mock-data'

const recyclingRequestModel = ({
  id: '1234',
  vehicleId: 'ZUG18',
  recyclingPartnerId: '1',
  recyclingPartner: {},
  requestType: '',
  nameOfRequestor: '',
  createdAt: new Date('2021-10-05T14:48:00.000Z'),
  updatedAt: new Date('2021-10-05T14:48:00.000Z'),
} as unknown) as RecyclingRequestModel

const getAllVehilceResp: AxiosResponse = {
  data: MockData.allVehiclesForPersidnoResponse,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
}
const getBasicVehicleResp: AxiosResponse = {
  data: MockData.basicVehicleInformationResponse,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
}

describe('skilavottordApiTest', () => {
  describe('getVehicleInformationTest', () => {
    let recyclingRequestService: RecyclingRequestService
    let samgongustofaService: SamgongustofaService
    let httpService: HttpService

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [HttpModule],
        providers: [
          SamgongustofaService,
          {
            provide: LOGGER_PROVIDER,
            useValue: logger,
          },
          {
            provide: RecyclingRequestService,
            useClass: jest.fn(() => ({
              findAllWithPermno: () => ({}),
            })),
          },
        ],
      }).compile()
      samgongustofaService = moduleRef.get<SamgongustofaService>(
        SamgongustofaService,
      )
      recyclingRequestService = moduleRef.get<RecyclingRequestService>(
        RecyclingRequestService,
      )
      httpService = moduleRef.get<HttpService>(HttpService)
    })

    describe('samgongustofaGetVehicleInformation', () => {
      it('get vehicle info', async () => {
        const kennitala = '1234567890'
        jest
          .spyOn(httpService, 'post')
          .mockImplementationOnce(() => of(getAllVehilceResp))
          .mockImplementationOnce(() => of(getBasicVehicleResp))
        jest
          .spyOn(
            recyclingRequestService as RecyclingRequestService,
            'findAllWithPermno',
          )
          .mockImplementation(() => Promise.resolve([recyclingRequestModel]))
        const checkVehileResp = await samgongustofaService.getVehicleInformation(
          kennitala,
        )
        expect(checkVehileResp[0].permno).toBe('BAT01')
      })
    })
  })
})
