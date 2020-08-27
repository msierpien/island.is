import { withLocale } from '../../i18n'
import { Subsidy } from '../../screens'
import { withAuth } from '../../auth'

export default withLocale('en', '/min-rettindi')(withAuth(Subsidy))
