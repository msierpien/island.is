/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import {
  Box,
  NavigationItem,
  Option,
  Select,
  Tag,
  Text,
  DialogPrompt,
  Input,
  LinkContext,
  Button,
  DatePicker,
  GridContainer,
  GridRow,
  GridColumn,
  LoadingDots,
} from '@island.is/island-ui/core'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  SyslumennAuction,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_SYSLUMENN_AUCTIONS_QUERY,
} from '../../queries'
import { Screen } from '../../../types'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { OrganizationWrapper } from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import getConfig from 'next/config'
import { useQuery } from '@apollo/client'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { useRouter } from 'next/router'
import { theme } from '@island.is/island-ui/theme'

const { publicRuntimeConfig } = getConfig()

interface AuctionsProps {
  organizationPage: Query['getOrganizationPage']
  syslumennAuctions: Query['getSyslumennAuctions']
  namespace: Query['getNamespace']
}

interface OfficeLocation {
  filterLabel: string
  slugValue: string
  office: string
  location: string
}

const OFFICE_LOCATIONS: OfficeLocation[] = [
  // All offices option
  {
    filterLabel: 'Öll embætti',
    slugValue: '',
    office: '',
    location: '',
  },

  // Höfuðborgarsvæðið
  {
    filterLabel: 'Höfuðborgarsvæðið',
    slugValue: 'syslumadurinn-a-hoefudborgarsvaedinu',
    office: 'Sýslumaðurinn á höfuðborgarsvæðinu',
    location: '',
  },

  // Vesturland
  {
    filterLabel: 'Vesturland',
    slugValue: 'syslumadurinn-a-vesturlandi',
    office: 'Sýslumaðurinn á Vesturlandi',
    location: '',
  },
  {
    filterLabel: ' - Akranes',
    slugValue: 'syslumadurinn-a-vesturlandi-akranes',
    office: 'Sýslumaðurinn á Vesturlandi',
    location: 'Akranes',
  },
  {
    filterLabel: ' - Borgarnes',
    slugValue: 'syslumadurinn-a-vesturlandi-borgarnes',
    office: 'Sýslumaðurinn á Vesturlandi',
    location: 'Borgarnes',
  },
  {
    filterLabel: ' - Stykkishólmur',
    slugValue: 'syslumadurinn-a-vesturlandi-stykkisholmur',
    office: 'Sýslumaðurinn á Vesturlandi',
    location: 'Stykkishólmur',
  },
  {
    filterLabel: ' - Búðardalur',
    slugValue: 'syslumadurinn-a-vesturlandi-budardalur',
    office: 'Sýslumaðurinn á Vesturlandi',
    location: 'Búðardalur',
  },

  // Vestfirðir
  {
    filterLabel: 'Vestfirðir',
    slugValue: 'syslumadurinn-a-vestfjordum',
    office: 'Sýslumaðurinn á Vestfjörðum',
    location: '',
  },
  {
    filterLabel: ' - Patreksfjörður',
    slugValue: 'syslumadurinn-a-vestfjordum-patreksfjordur',
    office: 'Sýslumaðurinn á Vestfjörðum',
    location: 'Patreksfjörður',
  },
  {
    filterLabel: ' - Ísafjörður',
    slugValue: 'syslumadurinn-a-vestfjordum-isafjordur',
    office: 'Sýslumaðurinn á Vestfjörðum',
    location: 'Ísafjörður',
  },
  {
    filterLabel: ' - Hólmavík',
    slugValue: 'syslumadurinn-a-vestfjordum-holmavik',
    office: 'Sýslumaðurinn á Vestfjörðum',
    location: 'Hólmavík',
  },

  // Norðurland vestra
  {
    filterLabel: 'Norðurland vestra',
    slugValue: 'syslumadurinn-a-nordurlandi-vestra',
    office: 'Sýslumaðurinn á Norðurlandi vestra',
    location: '',
  },
  {
    filterLabel: ' - Blönduós',
    slugValue: 'syslumadurinn-a-nordurlandi-vestra-blonduos',
    office: 'Sýslumaðurinn á Norðurlandi vestra',
    location: 'Blönduós',
  },
  {
    filterLabel: ' - Sauðárkrókur',
    slugValue: 'syslumadurinn-a-nordurlandi-vestra-saudarkrokur',
    office: 'Sýslumaðurinn á Norðurlandi vestra',
    location: 'Sauðárkrókur',
  },

  // Norðurland Eystra
  {
    filterLabel: 'Norðurland eystra',
    slugValue: 'syslumadurinn-a-nordurlandi-eystra',
    office: 'Sýslumaðurinn á Norðurlandi eystra',
    location: '',
  },
  {
    filterLabel: ' - Siglufjörður',
    slugValue: 'syslumadurinn-a-nordurlandi-eystra-siglufjordur',
    office: 'Sýslumaðurinn á Norðurlandi eystra',
    location: 'Siglufjörður',
  },
  {
    filterLabel: ' - Akureyri',
    slugValue: 'syslumadurinn-a-nordurlandi-eystra-akureyri',
    office: 'Sýslumaðurinn á Norðurlandi eystra',
    location: 'Akureyri',
  },
  {
    filterLabel: ' - Húsavík',
    slugValue: 'syslumadurinn-a-nordurlandi-eystra-husavik',
    office: 'Sýslumaðurinn á Norðurlandi eystra',
    location: 'Húsavík',
  },

  // Austurland
  {
    filterLabel: 'Austurland',
    slugValue: 'syslumadurinn-a-austurlandi',
    office: 'Sýslumaðurinn á Austurlandi',
    location: '',
  },
  {
    filterLabel: ' - Egilsstaðir',
    slugValue: 'syslumadurinn-a-austurlandi-egilsstaðir',
    office: 'Sýslumaðurinn á Austurlandi',
    location: 'Egilsstaðir',
  },
  {
    filterLabel: ' - Seyðisfjörður',
    slugValue: 'syslumadurinn-a-austurlandi-seydisfjordur',
    office: 'Sýslumaðurinn á Austurlandi',
    location: 'Seyðisfjörður',
  },
  {
    filterLabel: ' - Eskifjörður',
    slugValue: 'syslumadurinn-a-austurlandi-eskifjordur',
    office: 'Sýslumaðurinn á Austurlandi',
    location: 'Eskifjörður',
  },
  {
    filterLabel: ' - Vopnafjörður',
    slugValue: 'syslumadurinn-a-austurlandi-vopnafjordur',
    office: 'Sýslumaðurinn á Austurlandi',
    location: 'Vopnafjörður',
  },

  // Suðurland
  {
    filterLabel: 'Suðurland',
    slugValue: 'syslumadurinn-a-sudurlandi',
    office: 'Sýslumaðurinn á Suðurlandi',
    location: '',
  },
  {
    filterLabel: ' - Höfn',
    slugValue: 'syslumadurinn-a-sudurlandi-hofn',
    office: 'Sýslumaðurinn á Suðurlandi',
    location: 'Höfn',
  },
  {
    filterLabel: ' - Vík',
    slugValue: 'syslumadurinn-a-sudurlandi-vik',
    office: 'Sýslumaðurinn á Suðurlandi',
    location: 'Vík',
  },
  {
    filterLabel: ' - Hvolsvöllur',
    slugValue: 'syslumadurinn-a-sudurlandi-hvolsvollur',
    office: 'Sýslumaðurinn á Suðurlandi',
    location: 'Hvolsvöllur',
  },
  {
    filterLabel: ' - Selfoss',
    slugValue: 'syslumadurinn-a-sudurlandi-selfoss',
    office: 'Sýslumaðurinn á Suðurlandi',
    location: 'Selfoss',
  },

  // Suðurnes
  {
    filterLabel: 'Suðurnes',
    slugValue: 'syslumadurinn-a-sudurnesjum',
    office: 'Sýslumaðurinn á Suðurnesjum',
    location: '',
  },

  // Vestmannaeyjar
  {
    filterLabel: 'Vestmannaeyjar',
    slugValue: 'syslumadurinn-i-vestmannaeyjum',
    office: 'Sýslumaðurinn í Vestmannaeyjum',
    location: '',
  },
]

const KNOWN_LOCATIONS: string[] = OFFICE_LOCATIONS.map((x) => x.location)

const LOT_TYPES = {
  REAL_ESTATE: 'Fasteign',
  VEHICLE: 'Ökutæki',
  AIRCRAFT: 'Loftfar',
  SHIP: 'Skip',
  LIQUID_ASSETS: 'Lausafjármunir',
  SHAREHOLDING: 'Hlutafjáreign',
  SHAREHOLDING_PLC: 'Hlutafjáreign í einkahlutafélagi',
  SHAREHOLDING_LLC: 'Hlutafjáreign í hlutafélagi',
  STOCKS: 'Verðbréf',
  CLAIMS: 'Kröfuréttindi',
}

const AUCTION_TYPES = {
  START: 'Byrjun uppboðs',
  CONTINUATION: 'Framhald uppboðs',
  SOLD: 'Sölu lokið',
}

interface LotTypeOption {
  filterLabel: string
  value: string
  lotType: string
  auctionType: string
  excludeAuctionType: string
}

const LOT_TYPES_OPTIONS: LotTypeOption[] = [
  {
    filterLabel: 'Öll opin mál',
    value: 'oll-opin-mal',
    lotType: '',
    auctionType: '',
    excludeAuctionType: AUCTION_TYPES.SOLD,
  },
  {
    filterLabel: `${LOT_TYPES.REAL_ESTATE} - ${AUCTION_TYPES.START}`,
    value: 'fasteign-byrjun',
    lotType: LOT_TYPES.REAL_ESTATE,
    auctionType: AUCTION_TYPES.START,
    excludeAuctionType: '',
  },
  {
    filterLabel: `${LOT_TYPES.REAL_ESTATE} - ${AUCTION_TYPES.CONTINUATION}`,
    value: 'fasteign-framhald',
    lotType: LOT_TYPES.REAL_ESTATE,
    auctionType: AUCTION_TYPES.CONTINUATION,
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.VEHICLE,
    value: 'okutaeki',
    lotType: LOT_TYPES.VEHICLE,
    auctionType: '',
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.AIRCRAFT,
    value: 'loftfar',
    lotType: LOT_TYPES.AIRCRAFT,
    auctionType: '...',
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.SHIP,
    value: 'skip',
    lotType: LOT_TYPES.SHIP,
    auctionType: '',
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.LIQUID_ASSETS,
    value: 'lausafjarmunir',
    lotType: LOT_TYPES.LIQUID_ASSETS,
    auctionType: '',
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.SHAREHOLDING,
    value: 'hlutafjareign',
    lotType: LOT_TYPES.SHAREHOLDING,
    auctionType: '',
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.SHAREHOLDING_PLC,
    value: 'hlutafjareign-i-einkahlutafelagi',
    lotType: LOT_TYPES.SHAREHOLDING_PLC,
    auctionType: '',
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.SHAREHOLDING_LLC,
    value: 'hlutafjareign-i-hlutafelagi',
    lotType: LOT_TYPES.SHAREHOLDING_LLC,
    auctionType: '',
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.STOCKS,
    value: 'verdbref',
    lotType: LOT_TYPES.STOCKS,
    auctionType: '...',
    excludeAuctionType: '',
  },
  {
    filterLabel: LOT_TYPES.CLAIMS,
    value: 'krofurettindi',
    lotType: LOT_TYPES.CLAIMS,
    auctionType: '',
    excludeAuctionType: '',
  },
  {
    filterLabel: AUCTION_TYPES.SOLD,
    value: 'solu-lokid',
    lotType: '',
    auctionType: AUCTION_TYPES.SOLD,
    excludeAuctionType: '',
  },
]

const Auctions: Screen<AuctionsProps> = ({
  organizationPage,
  syslumennAuctions,
  namespace,
}) => {
  const { disableSyslumennPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { format } = useDateUtils()
  const Router = useRouter()
  const auctionDataFetched = new Date()

  const pageUrl = Router.pathname

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active:
        primaryLink.url === pageUrl ||
        childrenLinks.some((link) => link.url === pageUrl),
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  const [officeLocation, setOfficeLocation] = useState<OfficeLocation>(
    OFFICE_LOCATIONS[0],
  )
  const setOfficeLocationBySlugValue = (slugValue: string) => {
    const targetOfficeLocationList = OFFICE_LOCATIONS.filter(
      (o) => o.slugValue === slugValue,
    )
    const targetOfficeLocation =
      targetOfficeLocationList.length > 0
        ? targetOfficeLocationList[0]
        : OFFICE_LOCATIONS[0] // Fallback to first Office Location
    setOfficeLocation(targetOfficeLocation)
  }

  const [query, _setQuery] = useState(' ')
  const setQuery = (query: string) => _setQuery(query.toLowerCase())

  useEffect(() => {
    setQuery('')
  }, [])

  const [lotTypeOption, setLotTypeOption] = useState<LotTypeOption>(
    LOT_TYPES_OPTIONS[0],
  )
  const setLotTypeOptionByValue = (value: string) => {
    const targetLotTypeOptionList = LOT_TYPES_OPTIONS.filter(
      (o) => o.value === value,
    )
    const targetLotTypeOption =
      targetLotTypeOptionList.length > 0
        ? targetLotTypeOptionList[0]
        : LOT_TYPES_OPTIONS[0] // Fallback to first Lot Type Option
    setLotTypeOption(targetLotTypeOption)
  }

  const [date, setDate] = useState<Date>()

  const [showCount, setShowCount] = useState(10)

  const { loading, error, data } = useQuery<Query>(GET_SYSLUMENN_AUCTIONS_QUERY)

  useEffect(() => {
    const hashString = window.location.hash.replace('#', '')
    // Find the target Office by looking up Office slugValue.
    const targetOfficeLocationList = OFFICE_LOCATIONS.filter(
      (o) => o.slugValue === hashString,
    )
    const targetOfficeLocation =
      targetOfficeLocationList.length > 0
        ? targetOfficeLocationList[0]
        : OFFICE_LOCATIONS[0] // Fallback to first Office Location
    setOfficeLocation(targetOfficeLocation)
  }, [Router, setOfficeLocation])

  const filteredAuctions = syslumennAuctions.filter((auction) => {
    return (
      // Filter by office
      (officeLocation.office
        ? auction.office.toLowerCase() === officeLocation.office.toLowerCase()
        : true) &&
      // Filter by location
      (officeLocation.location
        ? auction.location.toLowerCase() ===
          officeLocation.location.toLowerCase()
        : true) &&
      // Filter by lot type
      (lotTypeOption.lotType
        ? auction.lotType === lotTypeOption.lotType
        : true) &&
      // Filter by auction type
      (lotTypeOption.auctionType
        ? auction.auctionType === lotTypeOption.auctionType
        : true) &&
      // Filter out excluded auction type
      (lotTypeOption.excludeAuctionType
        ? auction.auctionType !== lotTypeOption.excludeAuctionType
        : true) &&
      // Filter by Date
      (date
        ? auction.auctionDate.startsWith(format(date, 'yyyy-MM-dd'))
        : true) &&
      // Filter by search query
      (auction.lotName?.toLowerCase().includes(query) ||
        auction.lotId?.toLowerCase().includes(query) ||
        auction.lotItems?.toLowerCase().includes(query) ||
        auction.office?.toLowerCase().includes(query) ||
        auction.location?.toLowerCase().includes(query) ||
        (auction.lotType === LOT_TYPES.REAL_ESTATE &&
          auction.respondent?.toLowerCase().includes(query)) ||
        (auction.lotType === LOT_TYPES.REAL_ESTATE &&
          auction.petitioners?.toLowerCase().includes(query)))
    )
  })

  /**
   * The following code handles special cases in order to display certain information for
   * certain Auctions, information that should be handed from the external Syslumenn API
   * but has not been implemented yet. To accomplish this, we utilize Contentful to store
   * keywords to identify certain Auctions.
   */
  const vakaAuctionKeywords = (n(
    'auctionVakaAuctionKeywords',
    '',
  ) as string).split(';')
  const capitalAreaOffice = n(
    'auctionCapitalAreaOffice',
    'Sýslumaðurinn á höfuðborgarsvæðinu',
  )
  const auctionContainsVakaKeyword = (auction: SyslumennAuction) => {
    return vakaAuctionKeywords.some((keyword) => {
      return (
        keyword &&
        (auction.lotId === keyword ||
          auction.lotName.includes(keyword) ||
          auction.lotItems.includes(keyword))
      )
    })
  }
  const auctionAtVaka = (auction: SyslumennAuction) => {
    return (
      auction.office.toLowerCase() === capitalAreaOffice.toLowerCase() &&
      (auction.lotType === LOT_TYPES.VEHICLE ||
        auctionContainsVakaKeyword(auction))
    )
  }
  const getAuctionTakesPlaceAtAndExtraInfo = (auction: SyslumennAuction) => {
    if (auctionAtVaka(auction)) {
      return (
        <div>
          <Text paddingBottom={1}>
            {n('auctionTakesPlaceAt', 'Staðsetning uppboðs')}:{' '}
            {n(
              'auctionTakesPlaceAtVaka',
              'Uppboð verður haldið í aðstöðu Vöku hf., Héðinsgötu 1 - 3.',
            )}
          </Text>
          <Text variant="small">
            {n(
              'auctionRequiresNegativeTestResult',
              'Allir, fæddir 2015 og fyrr, þurfa að framvísa neikvæðri niðurstöðu úr hraðprófi (antigen) sem má ekki vera eldra en 48 klst.',
            )}
          </Text>
          <Text variant="small">
            {n('auctionRequiresFaceMask', 'Grímuskylda er á uppboðinu.')}
          </Text>
          <Text variant="small">
            {n(
              'auctionPaymentInfo',
              'Hvorki ávísanir né kreditkort eru tekin gild sem greiðsla einungis debetkort eða peningar. Greiðsla við hamarshögg.',
            )}
          </Text>
        </div>
      )
    } else if (
      auction.lotId &&
      auction.lotType === LOT_TYPES.REAL_ESTATE &&
      auction.auctionType === AUCTION_TYPES.CONTINUATION
    ) {
      return (
        <Text paddingBottom={1}>
          {n(
            'auctionRealEstateAuctionContinuationLocation',
            'Framhald uppboðs fasteignarinnar verður háð á fasteigninni sjálfri.',
          )}
        </Text>
      )
    }
  }

  return (
    <OrganizationWrapper
      pageTitle={n('auctions', 'Uppboð')}
      organizationPage={organizationPage}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
    >
      <Box marginBottom={6}>
        <Text variant="h1" as="h2">
          {n('auction', 'Uppboð')}
        </Text>
      </Box>
      <GridContainer>
        <GridRow>
          <GridColumn
            paddingTop={[0, 0, 0]}
            paddingBottom={2}
            span={['12/12', '12/12', '12/12', '12/12', '4/12']}
          >
            <Select
              backgroundColor="white"
              icon="chevronDown"
              size="sm"
              isSearchable
              label={n('auctionFilterOffice', 'Embætti')}
              name="officeSelect"
              options={OFFICE_LOCATIONS.map((x) => ({
                label: x.filterLabel,
                value: x.slugValue,
              }))}
              value={OFFICE_LOCATIONS.map((x) => ({
                label: x.filterLabel,
                value: x.slugValue,
              })).find((x) => x.value === officeLocation.slugValue)}
              onChange={({ value }: Option) => {
                setOfficeLocationBySlugValue(String(value))
                Router.replace(`#${value}`)
              }}
            />
          </GridColumn>
          <GridColumn
            paddingBottom={2}
            span={['12/12', '12/12', '12/12', '6/12', '4/12']}
          >
            <Select
              backgroundColor="white"
              icon="chevronDown"
              size="sm"
              isSearchable
              label={n('auctionFilterLotTypeLabel', 'Tegund uppboðs')}
              placeholder={n('auctionFilterLotTypePlaceholder', 'Veldu tegund')}
              name="officeSelect"
              options={LOT_TYPES_OPTIONS.map((x) => ({
                label: x.filterLabel,
                value: x.value,
              }))}
              value={LOT_TYPES_OPTIONS.map((x) => ({
                label: x.filterLabel,
                value: x.value,
              })).find((x) => x.value === lotTypeOption.value)}
              onChange={({ value }: Option) =>
                setLotTypeOptionByValue(String(value))
              }
            />
          </GridColumn>
          <GridColumn
            paddingBottom={2}
            span={['12/12', '12/12', '12/12', '6/12', '4/12']}
          >
            <DatePicker
              label={n('auctionFilterDateLabel', 'Dagsetning')}
              placeholderText={n('auctionFilterDatePlaceholder', 'Veldu dag')}
              size="sm"
              locale="is"
              selected={date}
              handleChange={(newDate: Date) => setDate(newDate)}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn paddingBottom={[1, 1, 1]} span={'12/12'}>
            <Input
              name="homestaySearchInput"
              placeholder={n('auctionFilterSearch', 'Leita eftir uppboði')}
              size="sm"
              icon="search"
              iconType="outline"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
      <Box
        display="flex"
        alignItems="flexEnd"
        flexDirection="column"
        paddingTop={2}
        paddingBottom={3}
      >
        <Text variant="small">
          Gögn sótt: {format(auctionDataFetched, "d. MMM yyyy 'kl.' HH:mm")}
        </Text>
      </Box>
      <Box
        borderTopWidth="standard"
        borderColor="standard"
        paddingTop={[4, 4, 6]}
        paddingBottom={[4, 5, 10]}
      >
        {loading && (
          <Box display="flex" marginTop={4} justifyContent="center">
            <LoadingDots />
          </Box>
        )}
        {(error || !filteredAuctions.length) && !loading && (
          <Box display="flex" marginTop={4} justifyContent="center">
            <Text variant="h3">
              {n('noAuctionsFound', 'Engin uppboð fundust')}
            </Text>
          </Box>
        )}
        {!loading &&
          !error &&
          filteredAuctions.slice(0, showCount).map((auction, index) => {
            const auctionDate = new Date(auction.auctionDate)
            const auctionPetitioners = auction.petitioners?.split(',')
            const auctionRespondents = auction.respondent?.split(',')

            return (
              <Box
                key={`auction-${index}`}
                borderWidth="standard"
                borderColor="standard"
                borderRadius="standard"
                paddingX={4}
                paddingY={3}
                marginBottom={4}
              >
                <Box
                  alignItems="flexStart"
                  display="flex"
                  flexDirection={[
                    'columnReverse',
                    'columnReverse',
                    'columnReverse',
                    'row',
                  ]}
                  justifyContent="spaceBetween"
                >
                  <Text variant="eyebrow" color="purple400" paddingTop={1}>
                    {format(auctionDate, 'd. MMMM yyyy')} - kl.{' '}
                    {auction.auctionTime}{' '}
                    {auction.location &&
                      KNOWN_LOCATIONS.includes(auction.location) &&
                      ' - ' + auction.location}
                  </Text>
                  <Box marginBottom={[2, 2, 2, 0]}>
                    <Tag disabled>{auction.office}</Tag>
                  </Box>
                </Box>
                <Box>
                  <Text variant="h3">{auction.lotName}</Text>

                  {/* Real Estate link */}
                  {auction.lotId &&
                    auction.lotType === LOT_TYPES.REAL_ESTATE && (
                      <LotLink
                        prefix={n(
                          'auctionRealEstateNumberPrefix',
                          'Fasteign nr. ',
                        )}
                        linkText={auction.lotId}
                        href={`https://www.skra.is/default.aspx?pageid=d5db1b6d-0650-11e6-943c-005056851dd2&selector=streetname&streetname=${auction.lotId}&submitbutton=Leita`}
                      />
                    )}

                  {/* Vehicle link */}
                  {auction.lotId && auction.lotType === LOT_TYPES.VEHICLE && (
                    <LotLink
                      prefix={n('auctionVehicleNumberPrefix', 'Bílnúmer: ')}
                      linkText={auction.lotId}
                      href={`https://www.samgongustofa.is/umferd/okutaeki/okutaekjaskra/uppfletting?vq=${auction.lotId}`}
                    />
                  )}

                  {/* Aircraft link */}
                  {auction.lotId && auction.lotType === LOT_TYPES.AIRCRAFT && (
                    <LotLink
                      prefix={n(
                        'auctionAircraftNumberPrefix',
                        'Númer loftfars: ',
                      )}
                      linkText={auction.lotId}
                      href={`https://www.samgongustofa.is/flug/loftfor/loftfaraskra?aq=${auction.lotId}`}
                    />
                  )}

                  {/* Ship link */}
                  {auction.lotId && auction.lotType === LOT_TYPES.SHIP && (
                    <LotLink
                      prefix={n('auctionShipNumberPrefix', 'Númer skips: ')}
                      linkText={auction.lotId}
                      href={`https://www.samgongustofa.is/siglingar/skrar-og-utgafa/skipaskra/uppfletting?sq=${auction.lotId}`}
                    />
                  )}

                  {/* Auction takes place at & auction extra info */}
                  {getAuctionTakesPlaceAtAndExtraInfo(auction)}

                  {/* Respondents */}
                  {auctionRespondents &&
                    auction.lotType === LOT_TYPES.REAL_ESTATE && (
                      <Text paddingTop={2} paddingBottom={1}>
                        {auctionRespondents.length > 1
                          ? n('auctionRespondentsPlural', 'Þinglýstir eigendur')
                          : n('auctionRespondentsSingle', 'Þinglýstur eigandi')}
                        : {auctionRespondents.join(', ')}
                      </Text>
                    )}

                  {/* Petitioners */}
                  {auctionPetitioners &&
                    auction.lotType === LOT_TYPES.REAL_ESTATE && (
                      <Text paddingBottom={1}>
                        {auctionPetitioners.length > 1
                          ? n('auctionPetitionersPlural', 'Gerðarbeiðendur')
                          : n('auctionPetitionersSingle', 'Gerðarbeiðandi')}
                        : {auctionPetitioners.join(', ')}
                      </Text>
                    )}

                  <Box
                    alignItems="flexEnd"
                    display="flex"
                    flexDirection="row"
                    justifyContent="spaceBetween"
                    marginLeft="auto"
                  >
                    <Box>
                      {auction.lotItems && (
                        <DialogPrompt
                          baseId={auction.lotId}
                          title={auction.lotName}
                          description={auction.lotItems
                            .split('|')
                            .join('  •  ')}
                          ariaLabel="Upplýsingar um innihald uppboðs."
                          disclosureElement={
                            <Button
                              variant="text"
                              size="small"
                              icon="arrowForward"
                            >
                              {n('auctionLotItemsLink', 'Nánar')}
                            </Button>
                          }
                        />
                      )}
                    </Box>
                    <Text variant="small">
                      {auction.lotType}{' '}
                      {auction.auctionType && ' - ' + auction.auctionType}
                    </Text>
                  </Box>
                </Box>
              </Box>
            )
          })}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        marginY={3}
        textAlign="center"
      >
        {showCount < filteredAuctions.length && (
          <Button onClick={() => setShowCount(showCount + 10)}>
            {n('auctionSeeMore', 'Sjá fleiri')} (
            {filteredAuctions.length - showCount})
          </Button>
        )}
      </Box>
    </OrganizationWrapper>
  )
}

const LotLink = ({
  prefix,
  linkText,
  href,
}: {
  prefix: string
  linkText: string
  href: string
}) => (
  <LinkContext.Provider
    value={{
      linkRenderer: (href, children) => (
        <a
          style={{
            color: theme.color.blue400,
          }}
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      ),
    }}
  >
    <Text paddingTop={2} paddingBottom={1}>
      {prefix} <a href={href}>{linkText}</a>
    </Text>
  </LinkContext.Provider>
)

Auctions.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getSyslumennAuctions },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: 'syslumenn',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query>({
      query: GET_SYSLUMENN_AUCTIONS_QUERY,
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

  return {
    organizationPage: getOrganizationPage,
    syslumennAuctions: getSyslumennAuctions,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Auctions, {
  headerButtonColorScheme: 'negative',
  headerColorScheme: 'white',
})
