import { setup } from '../../../../../test/setup'
import * as request from 'supertest'
import { INestApplication, CACHE_MANAGER } from '@nestjs/common'
import CacheManger from 'cache-manager'

let app: INestApplication
let cacheManager: CacheManger

beforeAll(async () => {
  app = await setup()
  cacheManager = app.get<CacheManger>(CACHE_MANAGER)
  cacheManager.ttl = () => ''

  Date.now = jest.fn(() => 1597760782018)
})

describe('Create DiscountCode', () => {
  it(`POST /api/private/users/:nationalId/discounts should return data`, async () => {
    const nationalId = '1326487905'
    const spy = jest.spyOn(cacheManager, 'set')
    const response = await request(app.getHttpServer())
      .post(`/api/private/users/${nationalId}/discounts`)
      .expect(201)

    expect(response.body).toEqual({
      discountCode: expect.any(String),
      expires: '2020-08-19T14:26:22.018Z',
      nationalId,
    })
    expect(spy).toHaveBeenCalled()
  })
})
