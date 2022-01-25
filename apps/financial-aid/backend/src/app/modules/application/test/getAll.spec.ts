import {
  ApplicationState,
  ApplicationStateUrl,
  Employment,
  FamilyStatus,
  getStateFromUrl,
  HomeCircumstances,
  Staff,
} from '@island.is/financial-aid/shared/lib'
import { Op } from 'sequelize'
import { uuid } from 'uuidv4'
import { StaffModel } from '../../staff/models/staff.model'
import { ApplicationWithAttachments } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: ApplicationWithAttachments[]
  error: Error
}

type GivenWhenThen = (
  stateUrl: ApplicationStateUrl,
  staff: Staff,
) => Promise<Then>

describe('ApplicationController - Get all', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationWithAttachments: typeof ApplicationWithAttachments

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
    } = await createTestingApplicationModule()

    mockApplicationWithAttachments = applicationModel

    givenWhenThen = async (
      stateUrl: ApplicationStateUrl,
      staff: Staff,
    ): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .getAll(stateUrl, staff)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const stateUrl = ApplicationStateUrl.NEW
    const municipalityCode = '0'
    const staff = { id: uuid(), municipalityId: municipalityCode } as Staff
    let mockGetAll: jest.Mock

    beforeEach(async () => {
      mockGetAll = mockApplicationWithAttachments.findAll as jest.Mock

      await givenWhenThen(stateUrl, staff)
    })

    it('should request new application from db', () => {
      expect(mockGetAll).toHaveBeenCalledWith({
        where: {
          state: { [Op.in]: getStateFromUrl[stateUrl] },
          municipalityCode,
        },
        order: [['modified', 'DESC']],
        include: [{ model: StaffModel, as: 'staff' }],
      })
    })
  })

  describe('database query - my cases', () => {
    const stateUrl = ApplicationStateUrl.MYCASES
    const municipalityCode = '0'
    const staffId = uuid()
    const staff = { id: staffId, municipalityId: municipalityCode } as Staff
    let mockGetAll: jest.Mock

    beforeEach(async () => {
      mockGetAll = mockApplicationWithAttachments.findAll as jest.Mock

      await givenWhenThen(stateUrl, staff)
    })

    it('should request my cases from db', () => {
      expect(mockGetAll).toHaveBeenCalledWith({
        where: {
          state: { [Op.in]: getStateFromUrl[stateUrl] },
          staffId,
          municipalityCode,
        },
        order: [['modified', 'DESC']],
        include: [{ model: StaffModel, as: 'staff' }],
      })
    })
  })

  describe('no application', () => {
    const stateUrl = ApplicationStateUrl.NEW
    const staff = { id: uuid(), municipalityId: '0' } as Staff
    let then: Then
    const expected = []

    beforeEach(async () => {
      const mockGetAll = mockApplicationWithAttachments.findAll as jest.Mock
      mockGetAll.mockReturnValueOnce(expected)

      then = await givenWhenThen(stateUrl, staff)
    })

    it('should return array of length 0', () => {
      expect(then.result.length).toBe(0)
    })

    it('should return empty array', () => {
      expect(then.result).toEqual(expected)
    })
  })

  describe('applications', () => {
    const stateUrl = ApplicationStateUrl.NEW
    const staff = { id: uuid(), municipalityId: '0' } as Staff
    let then: Then
    const application = {
      id: '1',
      nationalId: '1010101010',
      name: 'First Tester',
      phoneNumber: '',
      email: 'here@here.here',
      homeCircumstances: HomeCircumstances.UNKNOWN,
      homeCircumstancesCustom: '',
      employment: Employment.WORKING,
      student: false,
      usePersonalTaxCredit: true,
      hasIncome: false,
      bankNumber: '1',
      ledger: '1',
      accountNumber: '1',
      interview: false,
      formComment: '',
      state: ApplicationState.NEW,
      files: [],
      rejection: '',
      staffId: '123',
      familyStatus: FamilyStatus.COHABITATION,
      city: 'Rvk',
      streetName: 'that street',
      postalCode: '1',
      municipalityCode: '10',
    } as ApplicationWithAttachments
    const expected = [application, application, application]

    beforeEach(async () => {
      const mockGetAll = mockApplicationWithAttachments.findAll as jest.Mock
      mockGetAll.mockReturnValueOnce(expected)

      then = await givenWhenThen(stateUrl, staff)
    })

    it('should return array of length 3', () => {
      expect(then.result.length).toBe(3)
    })

    it('should return expected array', () => {
      expect(then.result).toEqual(expected)
    })
  })

  describe('database query fails', () => {
    const stateUrl = ApplicationStateUrl.NEW
    const staff = { id: uuid(), municipalityId: '0' } as Staff
    let then: Then

    beforeEach(async () => {
      const mockGetAll = mockApplicationWithAttachments.findAll as jest.Mock
      mockGetAll.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(stateUrl, staff)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
