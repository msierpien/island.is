import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import { Table as T } from '@island.is/island-ui/core'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Text,
  Stack,
  Columns,
  Column,
  Button,
  DropdownMenu,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FinanceStatusDataType,
  FinanceStatusOrganizationType,
} from './FinanceStatusData.types'
import { ExpandRow, ExpandHeader } from '../../components/ExpandableTable'
import FinanceStatusDetailTable from '../../components/FinanceStatusDetailTable/FinanceStatusDetailTable'
import * as styles from './FinanceStatus.treat'

const GetFinanceStatusQuery = gql`
  query GetFinanceStatusQuery {
    getFinanceStatus
  }
`

const FinanceStatus: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.finance-status')
  const { formatMessage } = useLocale()

  console.log('kennitala:: ', userInfo.profile.nationalId)
  const { loading, ...statusQuery } = useQuery<Query>(GetFinanceStatusQuery, {
    variables: {
      nationalID: '2704685439',
    },
  })
  const financeStatusData: FinanceStatusDataType =
    statusQuery.data?.getFinanceStatus || {}
  console.log({ financeStatusData, loading })

  const currencyKr = (kr: number) =>
    typeof kr === 'number' ? `${kr.toLocaleString('de-DE')} kr.` : ''
  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h1" as="h1">
          {formatMessage({
            id: 'service.portal:finance-status-title',
            defaultMessage: 'Staða við ríkissjóð og stofnanir',
          })}
        </Text>
        <Columns collapseBelow="sm">
          <Column width="8/12">
            <Text variant="intro">
              {formatMessage({
                id: 'service.portal:finance-status-intro',
                defaultMessage:
                  'Hafið samband við viðeigandi umsjónarmann til að fá frekari upplýsingar um stöðu og innheimtu.',
              })}
            </Text>
          </Column>
        </Columns>
        <Box marginTop={[3, 4, 4, 4, 5]}>
          <Columns space="p2" align="right">
            <Column width="content">
              <Button
                colorScheme="default"
                icon="documents" // Need to add Printer
                iconType="filled"
                onClick={function noRefCheck() {}}
                preTextIconType="filled"
                size="default"
                type="button"
                variant="utility"
              >
                Prenta
              </Button>
            </Column>
            <Column width="content">
              <Box className={styles.buttonWrapper}>
                <DropdownMenu
                  icon="ellipsisVertical" // Need to add ellipsisHorizontal
                  menuLabel="Fleiri möguleikar"
                  items={[
                    {
                      href: '#',
                      title: 'Staða í lok árs ...',
                    },
                    {
                      href: '#',
                      title: 'Sækja sem PDF',
                    },
                    {
                      onClick: function noRefCheck() {},
                      title: 'Sækja sem Excel',
                    },
                  ]}
                  title="Meira"
                />
              </Box>
            </Column>
          </Columns>
          {loading ? (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          ) : null}
          {financeStatusData?.organizations?.length > 0 ? (
            <Box marginTop={2}>
              <T.Table style={{ tableLayout: 'fixed' }}>
                <ExpandHeader
                  data={['Gjaldflokkur / stofnun', 'Umsjónarmaður', 'Staða']}
                />
                <T.Body>
                  {financeStatusData.organizations.map(
                    (org: FinanceStatusOrganizationType) =>
                      org.chargeTypes.map((chargeType) => (
                        <ExpandRow
                          key={chargeType.id}
                          data={[
                            chargeType.name,
                            org.name,
                            currencyKr(chargeType.totals),
                          ]}
                        >
                          <FinanceStatusDetailTable
                            organization={org}
                            chargeType={chargeType}
                          />
                        </ExpandRow>
                      )),
                  )}
                </T.Body>
              </T.Table>
            </Box>
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

export default FinanceStatus
