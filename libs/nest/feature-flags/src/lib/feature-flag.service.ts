import { Inject } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { Features } from '@island.is/feature-flags'
import type { FeatureFlagClient } from '@island.is/feature-flags'

import { FEATURE_FLAG_CLIENT } from './feature-flag.client'

export class FeatureFlagService {
  constructor(
    @Inject(FEATURE_FLAG_CLIENT)
    private readonly client: FeatureFlagClient,
  ) {}

  getValue(feature: Features, defaultValue: boolean | string, user?: User) {
    const featureFlagUser = user && { id: user.nationalId }
    return this.client.getValue(feature, defaultValue, featureFlagUser)
  }
}
