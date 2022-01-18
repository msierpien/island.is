import { Query } from '@island.is/api/schema'
import { UserProfileScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalRoute,
  ServicePortalGlobalComponent,
  m,
} from '@island.is/service-portal/core'
import { USER_PROFILE } from '@island.is/service-portal/graphql'

import { lazy } from 'react'
import * as Sentry from '@sentry/react'

export const personalInformationModule: ServicePortalModule = {
  name: 'Persónuupplýsingar',
  widgets: () => [],
  routes: ({ userInfo }) => {
    const routes: ServicePortalRoute[] = [
      {
        name: m.personalInformation,
        path: ServicePortalPath.SettingsPersonalInformation,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/UserProfile/UserProfile')),
      },
      {
        name: m.messages,
        path: ServicePortalPath.MessagesRoot,
        enabled: userInfo.scopes.includes(UserProfileScope.write),
        render: () => lazy(() => import('./screens/Messages/Messages')),
      },
    ]

    return routes
  },
  global: async ({ client, userInfo }) => {
    const routes: ServicePortalGlobalComponent[] = []

    /**
     * User Profile Onboarding
     */
    try {
      const res = await client.query<Query>({
        query: USER_PROFILE,
      })

      // If the user profile is empty, we render the onboarding modal
      if (
        // true
        process.env.NODE_ENV !== 'development' &&
        res.data?.getUserProfile === null &&
        userInfo.scopes.includes(UserProfileScope.write)
      )
        routes.push({
          render: () =>
            lazy(() =>
              import('./components/UserOnboardingModal/UserOnboardingModal'),
            ),
        })
    } catch (error) {
      Sentry.captureException(error)
    }

    return routes
  },
}
