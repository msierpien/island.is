import React from 'react'
import {
  FormattedMessage,
  FormattedDate,
  FormattedTime,
  defineMessage,
} from 'react-intl'
import { Header, Box, Divider, Page, Link } from '@island.is/island-ui/core'

import { withLocale, useLocale } from '@island.is/localization'

const welcomeMessage = defineMessage({
  id: 'global:welcome',
  defaultMessage: 'Hello, {name}!',
  description: 'Welcome message',
})

const Home = () => {
  const { lang, formatDate, formatTime, formatMessage } = useLocale()

  return (
    <div>
      <Page>
        <Box padding="containerGutter">
          <Header />
        </Box>
        <Box padding="containerGutter">
          <h2>Strings</h2>

          <FormattedMessage
            id="global:title" // namespace:messageId
            description="This is a title in the application namespace"
            defaultMessage="I'm a default title!"
          />

          <p>
            {formatMessage({
              id: 'global:description',
              description: 'This is a description in the application namespace',
              defaultMessage: "I'm a default description!",
            })}
          </p>
          <p>
            {formatMessage(welcomeMessage, {
              name: 'Foo',
            })}
          </p>
          <p>
            <FormattedMessage {...welcomeMessage} values={{ name: 'Bar' }} />
          </p>
        </Box>

        <Divider />
        <Box padding="containerGutter">
          <h2>Dates</h2>

          <span title={formatDate(new Date())}>
            <FormattedDate value={new Date()} />
          </span>
        </Box>
        <Divider />
        <Box padding="containerGutter">
          <h2>Time</h2>
          <span title={formatTime(new Date())}>
            <FormattedTime value={new Date()} />
          </span>
        </Box>
        <Box padding="containerGutter">
          <p>
            <Link href="/[lang]/about" as={`/${lang}/about`}>
              About page
            </Link>
          </p>
          <p>
            <Link href="/[lang]" as={`/${lang === 'en' ? 'is' : 'en'}`}>
              {lang === 'en' ? 'Icelandic' : 'English'}
            </Link>
          </p>
        </Box>
      </Page>
    </div>
  )
}

Home.getInitialProps = async (props) => {
  return {}
}

export default withLocale('global')(Home)
