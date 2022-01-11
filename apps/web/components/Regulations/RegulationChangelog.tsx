import * as s from './RegulationsSidebarBox.css'

import React, { useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { Text } from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import {
  ISODate,
  interpolate,
  prettyName,
  RegulationHistoryItem,
  RegulationMaybeDiff,
} from '@island.is/regulations'
import {
  RegulationsSidebarBox,
  RegulationsSidebarLink,
} from './RegulationsSidebarBox'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'

type Effects = Array<RegulationHistoryItem>

const CHANGELOG_COLLAPSE_LIMIT = 10

export const useRegulationEffectPrepper = (
  props: RegulationChangelogProps,
  opts: { reverse?: boolean } = {},
) => {
  const { regulation, texts } = props
  const txt = useNamespace(texts)
  const { formatDate } = useDateUtils()
  const { linkToRegulation } = useRegulationLinkResolver()
  const today = new Date().toISOString().substr(0, 10) as ISODate

  const { effects, isViewingCurrentVersion } = useMemo(() => {
    const effects = regulation.history.reduce<
      Record<'past' | 'future', Effects>
    >(
      (obj, item, i) => {
        const arr = item.date > today ? obj.future : obj.past
        arr.push(item)
        return obj
      },
      { past: [], future: [] },
    )
    if (opts.reverse) {
      effects.past.reverse()
      effects.future.reverse()
    }
    const isViewingCurrentVersion = !regulation.timelineDate || undefined

    return {
      effects,
      isViewingCurrentVersion,
    }
  }, [regulation, today, opts.reverse])

  const [expanded, setExpanded] = useState(
    () => effects.past.length < CHANGELOG_COLLAPSE_LIMIT,
  )
  useEffect(() => {
    setExpanded(effects.past.length < CHANGELOG_COLLAPSE_LIMIT)
  }, [effects])

  const isItemActive = (itemDate: ISODate) =>
    itemDate === (regulation.timelineDate || regulation.lastAmendDate)

  const renderCurrentVersion = () => (
    <RegulationsSidebarLink
      href={linkToRegulation(regulation.name)}
      current={isViewingCurrentVersion}
    >
      <span className={isViewingCurrentVersion && s.changelogActive}>
        {txt('historyCurrentVersion')}
      </span>
    </RegulationsSidebarLink>
  )

  const renderOriginalVersion = () => {
    const active = isItemActive(regulation.publishedDate)
    return (
      <RegulationsSidebarLink
        href={linkToRegulation(regulation.name, { original: true })}
        current={active}
        rel="nofollow"
      >
        <strong>{formatDate(regulation.publishedDate)}</strong>
        <br />
        <span className={cn(s.smallText, active && s.changelogActive)}>
          {txt(
            regulation.type === 'base'
              ? 'historyStart'
              : 'historyStartAmending',
          )}
        </span>
      </RegulationsSidebarLink>
    )
  }

  const renderEffects = (effects: Effects, collapse?: boolean) => {
    const effectList =
      !collapse || expanded
        ? effects
        : effects.slice(0, Math.max(CHANGELOG_COLLAPSE_LIMIT - 3, 1))

    return (
      <>
        {effectList.map((item, i) => {
          const name = prettyName(item.name)

          const label = interpolate(
            item.effect === 'amend'
              ? txt('historyChange')
              : txt('historyCancel'),
            { name },
          )
          const href =
            item.effect === 'amend'
              ? linkToRegulation(regulation.name, {
                  d: item.date,
                  diff: true,
                })
              : undefined

          const active = isItemActive(item.date)
          const className = cn(s.smallText, active && s.changelogActive)

          const Content = (
            <>
              <strong>{formatDate(item.date)}</strong>
              <br />
              <span className={className} title={label + ' ' + item.title}>
                {label}
              </span>
            </>
          )

          return href ? (
            <RegulationsSidebarLink
              key={i}
              href={href}
              current={active}
              rel="nofollow"
            >
              {Content}
            </RegulationsSidebarLink>
          ) : (
            <span className={s.sidebarNonLink}>{Content}</span>
          )
        })}
        {collapse && !expanded && (
          <button
            type="button"
            className={s.showAllChanges}
            onClick={() => setExpanded(true)}
          >
            {txt('historyExpand', 'Sýna allar breytingar')}
          </button>
        )}
      </>
    )
  }

  const renderPastSplitter = () => (
    <Text variant="small" marginBottom={1}>
      {txt('historyPastSplitter')}:
    </Text>
  )
  const renderFutureSplitter = () => (
    <Text variant="small" marginBottom={1}>
      {txt('historyFutureSplitter')}:
    </Text>
  )

  return {
    boxTitle: interpolate(txt('historyTitle'), {
      name: prettyName(regulation.name),
    }),
    hasPastEffects: effects.past.length > 0,
    hasFutureEffects: effects.future.length > 0,
    isViewingCurrentVersion,
    isItemActive,
    renderOriginalVersion,
    renderPastSplitter,
    renderPastEffects: (collapse?: boolean) =>
      renderEffects(effects.past, collapse),
    renderCurrentVersion,
    renderFutureSplitter,
    renderFutureEffects: () => renderEffects(effects.future),
  }
}

// ===========================================================================

// ===========================================================================

export type RegulationChangelogProps = {
  regulation: RegulationMaybeDiff
  texts: RegulationPageTexts
}

export const RegulationChangelog = (props: RegulationChangelogProps) => {
  const {
    boxTitle,
    // hasPastEffects,
    hasFutureEffects,
    renderCurrentVersion,
    renderPastSplitter,
    renderPastEffects,
    renderOriginalVersion,
    renderFutureSplitter,
    renderFutureEffects,
  } = useRegulationEffectPrepper(props, { reverse: true })

  if (!props.regulation.history.length) {
    return null
  }

  return (
    <RegulationsSidebarBox title={boxTitle}>
      {renderCurrentVersion()}

      {hasFutureEffects && renderFutureSplitter()}
      {renderFutureEffects()}

      {renderPastSplitter()}
      {/*
        Disable collapsing before launch because of usability/visibility concerns.
        Needs more user-testing and more advanced ui resolution when user is viewing
        a hidden/collapsed version...
      * /
        renderPastEffects(true)
      /**/}
      {renderPastEffects()}
      {renderOriginalVersion()}
    </RegulationsSidebarBox>
  )
}
