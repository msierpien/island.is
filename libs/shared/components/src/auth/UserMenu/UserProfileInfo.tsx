import React from 'react'
import { Button, Box, Icon, Text } from '@island.is/island-ui/core'
import { useFeatureFlag } from '@island.is/react/feature-flags'
import { useLocale } from '@island.is/localization'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { sharedMessages } from '@island.is/shared/translations'
import { useGetUserProfileQuery } from '../../../gen/graphql'
import * as styles from './UserMenu.css'

export const UserProfileInfo = () => {
  const { value: showPersonalInfo } = useFeatureFlag(
    'isServicePortalPersonalInformationModuleEnabled',
    false,
  )
  const { data } = useGetUserProfileQuery({
    skip: !showPersonalInfo,
    fetchPolicy: 'cache-and-network',
  })
  const { formatMessage } = useLocale()
  if (showPersonalInfo) {
    const settings = data?.getUserProfile

    const phoneNumber = parsePhoneNumberFromString(
      settings?.mobilePhoneNumber || '',
      'IS',
    )
    return (
      <>
        {settings?.email && (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={1}
            className={styles.breakWord}
          >
            <Box display="flex" alignItems="center" marginRight={2}>
              <Icon type="outline" icon="mail" color="blue300" />
            </Box>
            <Text>{settings.email}</Text>
          </Box>
        )}
        {phoneNumber?.isValid() && (
          <Box
            display="flex"
            alignItems="center"
            marginBottom={2}
            className={styles.breakWord}
          >
            <Box display="flex" alignItems="center" marginRight={2}>
              <Icon type="outline" icon="call" color="blue300" />
            </Box>
            <Text>{phoneNumber.nationalNumber}</Text>
          </Box>
        )}
        {(settings?.email || settings?.mobilePhoneNumber) && (
          <a href="/minarsidur/stillingar/personuupplysingar">
            <Button variant="text" icon="arrowForward" size="small">
              {formatMessage(sharedMessages.settings)}
            </Button>
          </a>
        )}
      </>
    )
  }
  return null
}
