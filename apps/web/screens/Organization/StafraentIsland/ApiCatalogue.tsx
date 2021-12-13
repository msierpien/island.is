/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {
  ArrowLink,
  Box,
  Button,
  GridContainer,
  LoadingDots,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  GetNamespaceQuery,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationSubpageArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_CATALOGUE_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_SUBPAGE_QUERY,
} from '../../queries'
import { Screen } from '../../../types'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import {
  ApiCatalogueFilter,
  OrganizationWrapper,
  ServiceList,
  SubpageDetailsContent,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useNamespace } from '@island.is/web/hooks'
import {
  GetApiCatalogueInput,
  QueryGetApiCatalogueArgs,
} from '@island.is/api/schema'
import { useQuery } from '@apollo/client'
import {
  AccessCategory,
  DataCategory,
  PricingCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { useRouter } from 'next/router'
import { INLINES } from '@contentful/rich-text-types'

const LIMIT = 20

interface HomestayProps {
  organizationPage: Query['getOrganizationPage']
  subpage: Query['getOrganizationSubpage']
  staticContent: GetNamespaceQuery['getNamespace']
  filterContent: GetNamespaceQuery['getNamespace']
  navigationLinks: GetNamespaceQuery['getNamespace']
}

const ApiCatalogue: Screen<HomestayProps> = ({
  organizationPage,
  subpage,
  staticContent,
  filterContent,
  navigationLinks,
}) => {
  const Router = useRouter()
  const sn = useNamespace(staticContent)
  const fn = useNamespace(filterContent)
  const nn = useNamespace(navigationLinks)
  const { linkResolver } = useLinkResolver()

  const onLoadMore = () => {
    if (data?.getApiCatalogue.pageInfo?.nextCursor === null) {
      return
    }

    const { nextCursor } = data?.getApiCatalogue?.pageInfo
    const param = { ...parameters, cursor: nextCursor }
    fetchMore({
      variables: { input: param },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        fetchMoreResult.getApiCatalogue.services = [
          ...prevResult.getApiCatalogue.services,
          ...fetchMoreResult.getApiCatalogue.services,
        ]
        return fetchMoreResult
      },
    })
  }
  const [parameters, setParameters] = useState<GetApiCatalogueInput>({
    cursor: null,
    limit: LIMIT,
    query: '',
    pricing: [],
    data: [],
    type: [],
    access: [],
  })

  const { data, loading, error, fetchMore, refetch } = useQuery<
    Query,
    QueryGetApiCatalogueArgs
  >(GET_CATALOGUE_QUERY, {
    variables: {
      input: parameters,
    },
  })

  useEffect(() => {
    refetch()
  }, [parameters])

  const filterCategories = [
    {
      id: 'pricing',
      label: fn('pricing'),
      selected: parameters.pricing,
      filters: [
        {
          value: PricingCategory.FREE,
          label: fn('pricingFree'),
        },
        {
          value: PricingCategory.PAID,
          label: fn('pricingPaid'),
        },
      ],
    },
    {
      id: 'data',
      label: fn('data'),
      selected: parameters.data,
      filters: [
        {
          value: DataCategory.FINANCIAL,
          label: fn('dataFinancial'),
        },
        {
          value: DataCategory.HEALTH,
          label: fn('dataHealth'),
        },
        {
          value: DataCategory.OFFICIAL,
          label: fn('dataOfficial'),
        },
        {
          value: DataCategory.OPEN,
          label: fn('dataOpen'),
        },
        {
          value: DataCategory.PERSONAL,
          label: fn('dataPersonal'),
        },
        {
          value: DataCategory.PUBLIC,
          label: fn('dataPublic'),
        },
      ],
    },
    {
      id: 'type',
      label: fn('type'),
      selected: parameters.type,
      filters: [
        {
          value: TypeCategory.REST,
          label: fn('typeRest'),
        },
        {
          value: TypeCategory.SOAP,
          label: fn('typeSoap'),
        },
      ],
    },
    {
      id: 'access',
      label: fn('access'),
      selected: parameters.access,
      filters: [
        {
          value: AccessCategory.APIGW,
          label: fn('accessApigw'),
        },
        {
          value: AccessCategory.XROAD,
          label: fn('accessXroad'),
        },
      ],
    },
  ]

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url === Router.asPath ||
        childrenLinks.some((link) => link.url === Router.asPath),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
        active: url === Router.asPath,
      })),
    }),
  )

  return (
    <>
      <OrganizationWrapper
        pageTitle={subpage.title}
        organizationPage={organizationPage}
        pageFeaturedImage={subpage.featuredImage}
        breadcrumbItems={[
          {
            title: 'Ísland.is',
            href: linkResolver('homepage').href,
          },
          {
            title: organizationPage.title,
            href: linkResolver('organizationpage', [organizationPage.slug])
              .href,
          },
        ]}
        navigationData={{
          title: nn('navigationTitle', 'Efnisyfirlit'),
          items: navList,
        }}
        showSecondaryMenu={false}
      >
        <Box paddingBottom={4}>
          <Text variant="h1" as="h2">
            {subpage.title}
          </Text>
        </Box>
        {richText(subpage.description as SliceType[], {
          renderNode: {
            [INLINES.HYPERLINK]: (node, children) => (
              <ArrowLink href={node.data.uri}>{children}</ArrowLink>
            ),
          },
        })}
      </OrganizationWrapper>
      <Box background="blue100" marginTop={[2, 2, 6]} paddingTop={[2, 2, 6]}>
        <SubpageDetailsContent
          header=""
          content={
            <SidebarLayout
              paddingTop={[3, 3, 5]}
              paddingBottom={[0, 0, 6]}
              sidebarContent={
                <Box paddingRight={[0, 0, 3]}>
                  <ApiCatalogueFilter
                    labelClear={fn('clear')}
                    labelOpen={fn('openFilterButton')}
                    labelClose={fn('closeFilter')}
                    labelResult={fn('mobileResult')}
                    labelTitle={fn('mobileTitle')}
                    resultCount={data?.getApiCatalogue?.services?.length ?? 0}
                    onFilterClear={() =>
                      setParameters({
                        query: '',
                        pricing: [],
                        data: [],
                        type: [],
                        access: [],
                      })
                    }
                    inputPlaceholder={fn('search')}
                    inputValue={parameters.query}
                    onInputChange={(value) =>
                      setParameters({ ...parameters, query: value })
                    }
                    labelCategoryClear={fn('clearCategory')}
                    onCategoryChange={({ categoryId, selected }) => {
                      setParameters({
                        ...parameters,
                        [categoryId]: selected,
                      })
                    }}
                    onCategoryClear={(categoryId) =>
                      setParameters({
                        ...parameters,
                        [categoryId]: [],
                      })
                    }
                    categories={filterCategories}
                  />
                </Box>
              }
            >
              <Box display={['block', 'block', 'none']} paddingBottom={4}>
                <ApiCatalogueFilter
                  isDialog={true}
                  labelClear={fn('clear')}
                  labelOpen={fn('openFilterButton')}
                  labelClose={fn('closeFilter')}
                  labelResult={fn('mobileResult')}
                  labelTitle={fn('mobileTitle')}
                  resultCount={data?.getApiCatalogue?.services?.length ?? 0}
                  onFilterClear={() =>
                    setParameters({
                      query: '',
                      pricing: [],
                      data: [],
                      type: [],
                      access: [],
                    })
                  }
                  inputPlaceholder={fn('search')}
                  inputValue={parameters.query}
                  onInputChange={(value) =>
                    setParameters({ ...parameters, query: value })
                  }
                  labelCategoryClear={fn('clearCategory')}
                  onCategoryChange={({ categoryId, selected }) => {
                    setParameters({
                      ...parameters,
                      [categoryId]: selected,
                    })
                  }}
                  onCategoryClear={(categoryId) =>
                    setParameters({
                      ...parameters,
                      [categoryId]: [],
                    })
                  }
                  categories={filterCategories}
                />
              </Box>

              {(error || data?.getApiCatalogue?.services.length < 1) && (
                <GridContainer>
                  {error ? (
                    <Text>{sn('errorHeading')}</Text>
                  ) : loading ? (
                    <LoadingDots />
                  ) : (
                    <Text>{sn('notFound')}</Text>
                  )}
                </GridContainer>
              )}
              {data?.getApiCatalogue?.services.length > 0 && (
                <GridContainer>
                  <ServiceList
                    baseUrl={linkResolver('apicataloguepage').href + '/'}
                    services={data?.getApiCatalogue?.services}
                    tagDisplayNames={filterContent}
                  />
                  {data?.getApiCatalogue?.pageInfo?.nextCursor != null && (
                    <Box display="flex" justifyContent="center">
                      <Button onClick={() => onLoadMore()} variant="ghost">
                        {!loading ? sn('fmButton') : <LoadingDots />}
                      </Button>
                    </Box>
                  )}
                </GridContainer>
              )}
            </SidebarLayout>
          }
        />
      </Box>
    </>
  )
}

ApiCatalogue.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationSubpage },
    },
    staticContent,
    filterContent,
    navigationLinks,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: 'stafraent-island',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationSubpageArgs>({
      query: GET_ORGANIZATION_SUBPAGE_QUERY,
      variables: {
        input: {
          organizationSlug: 'stafraent-island',
          slug: 'vefthjonustur',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalog',
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalogFilter',
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'ApiCatalogueLinks',
            lang: locale as ContentLanguage,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
  ])

  if (!getOrganizationSubpage) {
    throw new CustomNextError(404, 'Organization subpage not found')
  }

  return {
    organizationPage: getOrganizationPage,
    subpage: getOrganizationSubpage,
    staticContent,
    filterContent,
    navigationLinks,
    showSearchInHeader: false,
  }
}

export default withMainLayout(ApiCatalogue)
