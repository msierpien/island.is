import React, { useState } from 'react'
import { defineMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  NotFound,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Parents } from '../../components/Parents/Parents'
import ChildRegistrationModal from './ChildRegistrationModal'
import { format } from 'logform'

const NationalRegistryChildrenQuery = gql`
  query NationalRegistryChildrenQuery {
    nationalRegistryChildren {
      nationalId
      fullName
      displayName
      genderDisplay
      birthplace
      parent1
      nameParent1
      parent2
      nameParent2
      custody1
      custodyText1
      nameCustody1
      custody2
      custodyText2
      nameCustody2
      homeAddress
      religion
      nationality
    }
  }
`

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const editLink = defineMessage({
  id: 'sp.family:edit-link',
  defaultMessage: 'Breyta hjá Þjóðskrá',
})

const FamilyMember: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const [modalOpen, setModalOpen] = useState(false)
  const { formatMessage } = useLocale()
  console.log(userInfo)

  const { data, loading, error, called } = useQuery<Query>(
    NationalRegistryChildrenQuery,
  )
  const { nationalRegistryChildren } = data || {}

  const { nationalId }: { nationalId: string | undefined } = useParams()

  const person =
    nationalRegistryChildren?.find((x) => x.nationalId === nationalId) || null

  const isChild = nationalId === userInfo.profile.nationalId

  if (!nationalId || error || (!loading && !person))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )

  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            {loading ? (
              <LoadingDots />
            ) : (
              <Stack space={2}>
                <Text variant="h3" as="h1">
                  {person?.fullName || ''}
                </Text>
                {!isChild && (
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setModalOpen(true)}
                  >
                    {formatMessage({
                      id: 'sp.family:child-registration-button',
                      defaultMessage: 'Gera athugasemd við skráningu',
                    })}
                  </Button>
                )}
                <Text>
                  {formatMessage({
                    id: 'sp.family:data-info-child',
                    defaultMessage:
                      'Hér fyrir neðan eru gögn um fjölskyldumeðlim. Þú hefur kost á að gera breytingar á eftirfarandi upplýsingum ef þú kýst.',
                  })}
                </Text>
              </Stack>
            )}
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
          label={formatMessage(m.fullName)}
          content={person?.fullName || '...'}
          loading={loading}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url:
                    'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=703760ac-686f-11e6-943e-005056851dd2',
                }
              : undefined
          }
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.natreg)}
          content={formatNationalId(nationalId)}
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.legalResidence)}
          content={person?.homeAddress || '...'}
          loading={loading}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url: 'https://www.skra.is/folk/flutningur',
                }
              : undefined
          }
        />
        <Divider />
        <Box marginY={3} />

        <UserInfoLine
          title={formatMessage(m.baseInfo)}
          label={formatMessage({
            id: 'sp.family:birthplace',
            defaultMessage: 'Fæðingarstaður',
          })}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.birthplace || ''
          }
          loading={loading}
        />
        <Divider />
        {/* <UserInfoLine
          label={formatMessage(m.familyNumber)}
          content={
            error ? formatMessage(dataNotFoundMessage) : person?.postal || ''
          }
          loading={loading}
          tooltip={formatMessage({
            id: 'sp.family:family-number-tooltip',
            defaultMessage:
              'Fjölskyldunúmer er samtenging á milli einstaklinga á lögheimili, en veitir ekki upplýsingar um hverjir eru foreldrar barns eða forsjáraðilar.',
          })}
        />
        <Divider /> */}
        <UserInfoLine
          label={formatMessage(m.religion)}
          content={
            error ? formatMessage(dataNotFoundMessage) : person?.religion || ''
          }
          loading={loading}
          editLink={
            !isChild
              ? {
                  title: editLink,
                  external: true,
                  url:
                    'https://www.skra.is/umsoknir/rafraen-skil/tru-eda-lifsskodunarfelag-barna-15-ara-og-yngri/',
                }
              : undefined
          }
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.gender)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.genderDisplay || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={formatMessage(m.citizenship)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : person?.nationality || ''
          }
          loading={loading}
        />
        <Divider />
        <Box marginY={3} />
        <Parents
          title={formatMessage({
            id: 'sp.family:custody-and-parents',
            defaultMessage: 'Forsjá & foreldrar',
          })}
          label={formatMessage({
            id: 'sp.family:parents',
            defaultMessage: 'Foreldrar',
          })}
          parent1={person?.nameParent1}
          parent2={person?.nameParent2}
          loading={loading}
        />
        <Parents
          label={formatMessage(m.natreg)}
          parent1={person?.parent1}
          parent2={person?.parent2}
          loading={loading}
        />
        <Divider />
        <Parents
          label={formatMessage({
            id: 'sp.family:custody-parents',
            defaultMessage: 'Forsjáraðilar',
          })}
          parent1={person?.nameCustody1}
          parent2={person?.nameCustody2}
          loading={loading}
        />
        <Parents
          label={formatMessage(m.natreg)}
          parent1={person?.custody1}
          parent2={person?.custody2}
          loading={loading}
        />
        <Parents
          label={formatMessage({
            id: 'sp.family:custody-status',
            defaultMessage: 'Staða forsjár',
          })}
          parent1={person?.custodyText1}
          parent2={person?.custodyText2}
          loading={loading}
        />
        <Divider />
      </Stack>
      {modalOpen ? (
        <ChildRegistrationModal
          onClose={() => setModalOpen(false)}
          toggleClose={!modalOpen}
          data={{
            parentName: userInfo?.profile.name || '',
            parentNationalId: userInfo?.profile.nationalId,
            childName: person?.fullName || '',
            childNationalId: nationalId,
          }}
        >
          {}
        </ChildRegistrationModal>
      ) : null}
    </>
  )
}

export default FamilyMember
