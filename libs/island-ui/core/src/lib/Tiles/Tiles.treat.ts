import { styleMap } from 'treat'
import mapValues from 'lodash/mapValues'
import { theme, themeUtils } from '../../theme/index'
type Theme = typeof theme

const columnsWidths = {
  1: '100%',
  2: `${100 / 2}%`,
  3: `${100 / 3}%`,
  4: `${100 / 4}%`,
  5: `${100 / 5}%`,
  6: `${100 / 6}%`,
} as const

type ColumnWidths = Record<keyof typeof columnsWidths, string>
const makeColumnsAtoms = (breakpoint: keyof Theme['breakpoint']) =>
  styleMap(
    mapValues(columnsWidths, (width) =>
      themeUtils.responsiveStyle({ [breakpoint]: { flex: `0 0 ${width}` } }),
    ),
    `columns_${breakpoint}`,
  ) as ColumnWidths

export const columnsXs = makeColumnsAtoms('xs')
export const columnsSm = makeColumnsAtoms('sm')
export const columnsMd = makeColumnsAtoms('md')
export const columnsLg = makeColumnsAtoms('lg')
export const columnsXl = makeColumnsAtoms('xl')
