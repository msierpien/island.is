import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const familyModule: ServicePortalModule = {
  name: 'Fjölskyldan',
  widgets: () => [],
  routes: () => [
    {
      name: 'Fjölskyldan',
      path: ServicePortalPath.FjolskyldanRoot,
      render: () =>
        lazy(() => import('./screens/FamilyOverview/FamilyOverview')),
    },
    {
      name: 'Mínar upplýsingar',
      path: ServicePortalPath.MinarUpplysingar,
      render: () => lazy(() => import('./screens/UserInfo/UserInfo')),
    },
  ],
}
