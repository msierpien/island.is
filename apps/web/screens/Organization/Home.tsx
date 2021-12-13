/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Button, NavigationItem, Text } from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import { Screen } from '../../types'
import { useNamespace } from '@island.is/web/hooks'
import {
  lightThemes,
  OrganizationSlice,
  OrganizationWrapper,
  SearchBox,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'
import useContentfulId from '@island.is/web/hooks/useContentfulId'

const { publicRuntimeConfig } = getConfig()

interface HomeProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
}

const WITH_SEARCH = ['syslumenn', 'sjukratryggingar', 'utlendingastofnun']

const Home: Screen<HomeProps> = ({ organizationPage, namespace }) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
  useContentfulId(organizationPage.id)

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: false,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      pageTitle={organizationPage.title}
      pageDescription={organizationPage.description}
      organizationPage={organizationPage}
      pageFeaturedImage={organizationPage.featuredImage}
      fullWidthContent={true}
      namespace={namespace}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      mainContent={organizationPage.slices.map((slice) => (
        <OrganizationSlice
          key={slice.id}
          slice={slice}
          namespace={namespace}
          organizationPageSlug={organizationPage.slug}
        />
      ))}
      sidebarContent={
        <>
          {WITH_SEARCH.includes(organizationPage.slug) && (
            <SearchBox
              organizationPage={organizationPage}
              placeholder={n('searchServices', 'Leitaðu að þjónustu')}
              noResultsText={n(
                'noServicesFound',
                'Engar niðurstöður í þjónustu sýslumanna',
              )}
              searchAllText={n(
                'searchAllServices',
                'Leita í öllu efni Ísland.is',
              )}
            />
          )}
        </>
      }
    >
      {organizationPage.bottomSlices.map((slice) => (
        <OrganizationSlice
          key={slice.id}
          slice={slice}
          namespace={namespace}
          organizationPageSlug={organizationPage.slug}
          fullWidth={true}
        />
      ))}
    </OrganizationWrapper>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Syslumenn',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization not found')
  }

  const lightTheme = lightThemes.includes(getOrganizationPage.theme)

  return {
    organizationPage: getOrganizationPage,
    namespace,
    showSearchInHeader: false,
    ...(lightTheme ? {} : { darkTheme: true }),
  }
}

export default withMainLayout(Home)
