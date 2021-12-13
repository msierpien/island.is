import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const defenderOptions = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: theme.spacing[2],
  marginBottom: theme.spacing[2],
})
