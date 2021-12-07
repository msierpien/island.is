/* eslint-disable @typescript-eslint/no-non-null-assertion */

export type ResponsiveProp<AtomName> =
  | AtomName
  | Readonly<[AtomName, AtomName]>
  | Readonly<[AtomName, AtomName, AtomName]>
  | Readonly<[AtomName, AtomName, AtomName, AtomName]>
  | Readonly<[AtomName, AtomName, AtomName, AtomName, AtomName]>
  | Readonly<[AtomName, AtomName, AtomName, AtomName, AtomName, AtomName]>

export const normaliseResponsiveProp = <Keys extends string | number>(
  value: ResponsiveProp<Keys>,
): Readonly<[Keys, Keys, Keys, Keys, Keys, Keys]> => {
  if (typeof value === 'string' || typeof value === 'number') {
    return [value, value, value, value, value, value]
  }

  if (Array.isArray(value)) {
    const { length } = value

    if (length === 2) {
      const [xsValue, smValue] = value
      return [xsValue, smValue, smValue, smValue, smValue, smValue]
    }

    if (length === 3) {
      const [xsValue, smValue, mdValue] = value
      return [
        xsValue,
        smValue,
        mdValue as Keys,
        mdValue as Keys,
        mdValue as Keys,
        mdValue as Keys,
      ]
    }

    if (length === 4) {
      const [xsValue, smValue, mdValue, lgValue] = value
      return [
        xsValue,
        smValue,
        mdValue as Keys,
        lgValue as Keys,
        lgValue as Keys,
        lgValue as Keys,
      ]
    }

    if (length === 5) {
      const [xsValue, smValue, mdValue, lgValue, xlValue] = value
      return [
        xsValue,
        smValue,
        mdValue as Keys,
        lgValue as Keys,
        xlValue as Keys,
        xlValue as Keys,
      ]
    }

    if (length === 6) {
      return value as Readonly<[Keys, Keys, Keys, Keys, Keys, Keys]>
    }

    if (length === 1) {
      const [xsValue] = value
      return [xsValue, xsValue, xsValue, xsValue, xsValue, xsValue]
    }

    throw new Error(`Invalid responsive prop length: ${JSON.stringify(value)}`)
  }

  throw new Error(`Invalid responsive prop value: ${JSON.stringify(value)}`)
}

export const mapResponsiveProp = <
  Keys extends string | number,
  MappedValues extends string
>(
  value: ResponsiveProp<Keys> | undefined,
  valueMap: Record<Keys, MappedValues>,
): ResponsiveProp<MappedValues> | undefined => {
  if (value === undefined) {
    return // return value
  }

  // If it's not a responsive prop, just map it directly
  if (typeof value === 'string' || typeof value === 'number') {
    return valueMap[value]
  }

  const [
    xsValue,
    smValue,
    mdValue,
    lgValue,
    xlValue,
    xxlValue,
  ] = normaliseResponsiveProp(value)

  return [
    valueMap[xsValue],
    valueMap[smValue],
    valueMap[mdValue],
    valueMap[lgValue],
    valueMap[xlValue],
    valueMap[xxlValue],
  ]
}

export const resolveResponsiveProp = <Keys extends string | number>(
  value: ResponsiveProp<Keys>,
  xsAtoms: Record<Keys, string>,
  smAtoms: Record<Keys, string>,
  mdAtoms: Record<Keys, string>,
  lgAtoms: Record<Keys, string>,
  xlAtoms: Record<Keys, string>,
  xxlAtoms: Record<Keys, string>,
) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return xsAtoms[value!]
  }

  const [
    xsValue,
    smValue,
    mdValue,
    lgValue,
    xlValue,
    xxlValue,
  ] = normaliseResponsiveProp(value)

  return `${xsAtoms[xsValue!]}${
    smValue !== xsValue ? ` ${smAtoms[smValue!]}` : ''
  }${mdValue !== smValue ? ` ${mdAtoms[mdValue!]}` : ''}${
    lgValue !== mdValue ? ` ${lgAtoms[lgValue!]}` : ''
  }${xlValue !== lgValue ? ` ${xlAtoms[xlValue!]}` : ''}${
    xxlValue !== xlValue ? ` ${xxlAtoms[xxlValue!]}` : ''
  }`
}
