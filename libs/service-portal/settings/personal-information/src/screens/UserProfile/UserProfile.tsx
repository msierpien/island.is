import React from 'react'
import {
  Box,
  Stack,
  Text,
  SkeletonLoader,
  Tag,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { UserInfoLine, m } from '@island.is/service-portal/core'
import { FamilyMemberCard } from '@island.is/service-portal/family'
import { useUserProfileAndIslykill } from '@island.is/service-portal/graphql'

const UserProfile: ServicePortalModuleComponent = ({ userInfo, client }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()

  const { data: settings, loading } = useUserProfileAndIslykill()

  return (
    <>
      {loading && <SkeletonLoader width="100%" height={100} />}
      {!loading && (
        <Stack space={1}>
          <Box marginBottom={5}>
            <Text variant="h1" as="h1">
              {formatMessage(m.personalInformation)}
            </Text>
          </Box>
          <Box marginBottom={[2, 3]}>
            <FamilyMemberCard title={userInfo.profile.name || ''} />
          </Box>
          <UserInfoLine
            label={m.email}
            labelColumnSpan={['8/12', '3/12']}
            editColumnSpan={['1/1', '2/12']}
            valueColumnSpan={['1/1', '7/12']}
            renderContent={() => (
              <Box display="flex" alignItems="center">
                <Box marginRight={2}>{settings?.email || ''}</Box>
                {settings?.email && settings?.emailVerified === true ? (
                  <Tag variant="blueberry" outlined disabled>
                    {formatMessage({
                      id: 'sp.settings:verified',
                      defaultMessage: 'Staðfest',
                    })}
                  </Tag>
                ) : settings?.email && settings?.emailVerified === false ? (
                  <Tag variant="red" disabled>
                    {formatMessage({
                      id: 'sp.settings:not-verified',
                      defaultMessage: 'Óstaðfest',
                    })}
                  </Tag>
                ) : (
                  <div />
                )}
              </Box>
            )}
            editLink={{
              url: ServicePortalPath.SettingsPersonalInformationEditEmail,
            }}
          />
          <UserInfoLine
            label={m.telNumber}
            labelColumnSpan={['8/12', '3/12']}
            editColumnSpan={['1/1', '2/12']}
            valueColumnSpan={['1/1', '7/12']}
            editLink={{
              url: ServicePortalPath.SettingsPersonalInformationEditPhoneNumber,
            }}
            renderContent={() => (
              <Box display="flex" alignItems="center">
                <Box marginRight={2}>{settings?.mobile || ''}</Box>
                {settings?.mobile &&
                settings?.mobilePhoneNumberVerified === true ? (
                  <Tag variant="blueberry" outlined disabled>
                    {formatMessage({
                      id: 'sp.settings:verified',
                      defaultMessage: 'Staðfest',
                    })}
                  </Tag>
                ) : settings?.mobilePhoneNumber &&
                  settings?.mobilePhoneNumberVerified === false ? (
                  <Tag variant="red" disabled>
                    {formatMessage({
                      id: 'sp.settings:not-verified',
                      defaultMessage: 'Óstaðfest',
                    })}
                  </Tag>
                ) : (
                  <div />
                )}
              </Box>
            )}
          />
          <UserInfoLine
            label={m.nudge}
            labelColumnSpan={['8/12', '3/12']}
            editColumnSpan={['1/1', '2/12']}
            valueColumnSpan={['1/1', '7/12']}
            content={
              settings?.canNudge
                ? formatMessage({
                    id: 'sp.settings:nudge-active',
                    defaultMessage: 'Hnipp virkt',
                  })
                : formatMessage({
                    id: 'sp.settings:nudge-inactive',
                    defaultMessage: 'Hnipp óvirkt',
                  })
            }
            editLink={{
              url: ServicePortalPath.SettingsPersonalInformationEditNudge,
            }}
          />
          <UserInfoLine
            label={m.language}
            content={
              settings
                ? settings?.locale === 'is'
                  ? 'Íslenska'
                  : settings?.locale === 'en'
                  ? 'English'
                  : ''
                : ''
            }
            labelColumnSpan={['8/12', '3/12']}
            editColumnSpan={['1/1', '2/12']}
            valueColumnSpan={['1/1', '7/12']}
            editLink={{
              url: ServicePortalPath.SettingsPersonalInformationEditLanguage,
            }}
          />
          <UserInfoLine
            label={m.bankAccountInfo}
            labelColumnSpan={['8/12', '3/12']}
            editColumnSpan={['1/1', '2/12']}
            valueColumnSpan={['1/1', '7/12']}
            content={settings?.bankInfo ?? ''}
          />
        </Stack>
      )}
    </>
  )
}

export default UserProfile
