import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const familyModule: ServicePortalModule = {
  name: 'Fjölskyldan',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: 'Mínar upplýsingar',
      path: ServicePortalPath.MyInfoRoot,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () =>
        lazy(() => import('./screens/UserInfoOverview/UserInfoOverview')),
    },
    {
      name: m.userInfo,
      path: ServicePortalPath.UserInfo,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () => lazy(() => import('./screens/UserInfo/UserInfo')),
    },
    {
      name: m.family,
      path: ServicePortalPath.FamilyRoot,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () =>
        lazy(() => import('./screens/FamilyOverview/FamilyOverview')),
    },
    {
      name: 'Family Member',
      path: ServicePortalPath.FamilyMember,
      enabled: userInfo.scopes.includes(ApiScope.meDetails),
      render: () => lazy(() => import('./screens/FamilyMember/FamilyMember')),
    },
  ],
}

export * from './components/FamilyMemberCard/FamilyMemberCard'
