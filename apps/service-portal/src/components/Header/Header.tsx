import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Hidden,
  ResponsiveSpace,
  ContentBlock,
  Button,
  Inline,
} from '@island.is/island-ui/core'
import * as styles from './Header.treat'
import { Logo } from '../Logo/Logo'
import UserMenu from '../UserMenu/UserMenu'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { Locale, useLocale, useNamespaces } from '@island.is/localization'
import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import NotificationMenuTrigger from '../Notifications/NotificationMenuTrigger'

export const Header: FC<{}> = () => {
  const { lang } = useLocale()
  const [{ mobileMenuState }, dispatch] = useStore()
  const { changeLanguage } = useNamespaces(['service.portal'])

  const handleLangClick = (value: Locale) => changeLanguage(value)
  const handleMobileMenuClose = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })

  return (
    <>
      <div className={styles.placeholder} />
      <header className={styles.header}>
        <Box width="full">
          <ContentBlock>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
              height="full"
              background="white"
              paddingX={[2, 2, 4, 4, 6]}
            >
              <Link to={ServicePortalPath.MinarSidurRoot}>
                <Hidden above="md">
                  <Logo width={40} iconOnly />
                </Hidden>
                <Hidden below="lg">
                  <Logo />
                </Hidden>
              </Link>
              <Inline space={[1, 1, 1, 2]}>
                <Button
                  variant="menu"
                  onClick={handleLangClick.bind(
                    null,
                    lang === 'is' ? 'en' : 'is',
                  )}
                >
                  {lang === 'is' ? 'EN' : 'IS'}
                </Button>
                <UserMenu />
                <NotificationMenuTrigger />
                {mobileMenuState === 'open' && (
                  <Hidden above="md">
                    <Box>
                      <Button
                        variant="menu"
                        icon="close"
                        onClick={handleMobileMenuClose}
                      />
                    </Box>
                  </Hidden>
                )}
              </Inline>
            </Box>
          </ContentBlock>
        </Box>
      </header>
    </>
  )
}

export default Header
