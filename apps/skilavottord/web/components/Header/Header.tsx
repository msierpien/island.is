import React, { FC, useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import { UserContext } from '@island.is/skilavottord-web/context'
import { api } from '@island.is/skilavottord-web/services'
import { Locale } from '@island.is/skilavottord-web/i18n/I18n'
import { getRoutefromLocale } from '@island.is/skilavottord-web/utils/routesMapper'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'

const mockUser = {
  name: 'Mock User',
  nationalId: '2222222222',
  mobile: 123456,
  // role: 'citizen',
  role: 'developer',
  // role: 'recyclingPartner',
  // role: 'recyclingFund',
}

export const UserQuery = gql`
  query UserQuery {
    user {
      name
      nationalId
      mobile
    }
  }
`

export const Header: FC = () => {
  const router = useRouter()
  const { setUser, isAuthenticated } = useContext(UserContext)
  const {
    activeLocale,
    locale,
    t: { header: t, routes },
  } = useI18n()

  const { data } = useQuery(UserQuery)
  const user = data?.user || mockUser

  const nextLanguage = activeLocale === 'is' ? 'en' : 'is'

  const switchLanguage = async (toLanguage: Locale) => {
    const route = await getRoutefromLocale(
      router.pathname,
      activeLocale,
      toLanguage,
    )
    const queryKeys = Object.keys(router.query)
    const path = queryKeys.reduce(
      (acc, key) => acc.replace(`[${key}]`, router.query[key].toString()),
      route,
    )
    if (route) {
      router.replace(route, path)
      locale(toLanguage)
    }
  }

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  const homeRoute = routes.home[user?.role] ?? routes.home['citizen']

  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href={homeRoute}>
          <a>{logo}</a>
        </Link>
      )}
      logoutText={t.logoutText}
      userLogo={user?.role === 'developer' ? '👑' : undefined}
      language={nextLanguage.toUpperCase()}
      switchLanguage={() => switchLanguage(nextLanguage)}
      userName={user?.name ?? ''}
      authenticated={isAuthenticated}
      onLogout={() => {
        api.logout().then(() => router.push(homeRoute))
      }}
    />
  )
}

export default Header
