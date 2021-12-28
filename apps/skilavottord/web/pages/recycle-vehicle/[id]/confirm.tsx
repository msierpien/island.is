import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Confirm } from '@island.is/skilavottord-web/screens'
import { withApollo } from '@island.is/skilavottord-web/graphql/withApollo'

export default withApollo(withLocale('is')(Confirm as Screen))
