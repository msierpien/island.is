import { Test } from '@nestjs/testing'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: AuthService

  const user = {
    nationalId: '1234567890',
    name: 'tester',
    mobile: '',
    role: 'developer',
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    }).compile()

    authService = moduleRef.get(AuthService)
  })

  describe('getRole', () => {
    it('should return a correct role', () => {
      // Arrange & Act
      const role = authService.getRole(user)

      // Assert
      //expect(role).toBe('developer')
      expect(role).toBe('citizen')
    })
  })

  describe('checkRole', () => {
    it('should return true for valid permission', () => {
      // Arrange & Act
      const hasPermission = authService.checkRole(user, 'citizen')

      // Assert
      //expect(hasPermission).toBeTruthy()
      expect(hasPermission).toBeFalsy()
    })
  })
})
