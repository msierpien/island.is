import fetch from 'isomorphic-fetch'
import { uuid } from 'uuidv4'

import { BadGatewayException, BadRequestException } from '@nestjs/common'

import { Case as TCase } from '@island.is/judicial-system/types'

import { environment } from '../../environments'
import { CreateCaseDto } from '../app.dto'
import { Case } from '../app.model'
import { createTestingAppModule } from './createTestingAppModule'

jest.mock('isomorphic-fetch')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (caseToCreate: CreateCaseDto) => Promise<Then>

describe('AppController - Greate', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const appController = await createTestingAppModule()

    givenWhenThen = async (caseToCreate: CreateCaseDto): Promise<Then> => {
      const then = {} as Then

      await appController
        .create(caseToCreate)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('remote call', () => {
    const caseToCreate = {} as CreateCaseDto

    beforeEach(async () => {
      await givenWhenThen(caseToCreate)
    })

    it('should initiate case creation', () => {
      expect(fetch).toHaveBeenCalledWith(
        `${environment.backend.url}/api/internal/case/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${environment.auth.secretToken}`,
          },
          body: JSON.stringify(caseToCreate),
        },
      )
    })
  })

  describe('case created', () => {
    const caseToCreate = {} as CreateCaseDto
    const caseId = uuid()
    const theCase = { id: caseId } as TCase
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(theCase),
      })

      then = await givenWhenThen(caseToCreate)
    })

    it('should return a new case', () => {
      console.log(then)
      expect(then.result).toEqual({ id: caseId })
    })
  })

  describe('bad request', () => {
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        message: 'Some message',
      })

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Could not create a new case')
    })
  })

  describe('creation fails', () => {
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: false,
      })

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw BadGatewayException', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe('Could not create a new case')
    })
  })

  describe('invalid json', () => {
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error('Some error')),
      })

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw a BadGatewayException', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe('Could not create a new case')
    })
  })

  describe('remote call fails', () => {
    const caseToCreate = {} as CreateCaseDto
    let then: Then

    beforeEach(async () => {
      const mockFetch = fetch as jest.Mock
      mockFetch.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseToCreate)
    })

    it('should throw a BadGatewayException', () => {
      expect(then.error).toBeInstanceOf(BadGatewayException)
      expect(then.error.message).toBe('Could not create a new case')
    })
  })
})
