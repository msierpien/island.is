import { CanActivate } from '@nestjs/common'

import { TokenGuard } from '@island.is/judicial-system/auth'

import { CaseController } from '../case.controller'

describe('CaseController - Internal create guards', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guards: any[]

  beforeEach(() => {
    guards = Reflect.getMetadata(
      '__guards__',
      CaseController.prototype.internalCreate,
    )
  })

  it('should have four guards', () => {
    expect(guards).toHaveLength(1)
  })

  describe('TokenGuard', () => {
    let guard: CanActivate

    beforeEach(() => {
      guard = new guards[0]()
    })

    it('should have TokenGuard as quard 1', () => {
      expect(guard).toBeInstanceOf(TokenGuard)
    })
  })
})
