import * as s from './RegulationStatus.css'

import React from 'react'
import {
  ISODate,
  interpolate,
  toISODate,
  RegulationMaybeDiff,
} from '@island.is/regulations'
import { Link, Text } from '@island.is/island-ui/core'
import { useDateUtils, useRegulationLinkResolver } from './regulationUtils'
import { RegulationPageTexts } from './RegulationTexts.types'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import { Ball, BallColor } from './Ball'

// ---------------------------------------------------------------------------

export type RegulationStatusProps = {
  regulation: RegulationMaybeDiff
  urlDate?: ISODate
  texts: RegulationPageTexts
}

export const RegulationStatus = (props: RegulationStatusProps) => {
  const { regulation, urlDate, texts } = props
  const { formatDate } = useDateUtils()
  const txt = useNamespace(texts)
  const { linkToRegulation } = useRegulationLinkResolver()

  const {
    type,
    name,
    timelineDate,
    lastAmendDate,
    publishedDate,
    repealed,
    repealedDate,
    history,
  } = regulation

  const today = toISODate(new Date())

  const color: BallColor = repealed
    ? 'red'
    : type === 'amending'
    ? 'yellow'
    : !timelineDate || timelineDate === (lastAmendDate || publishedDate)
    ? 'green'
    : 'yellow'

  const onDateText = urlDate && (
    <small className={s.metaDate}>
      {interpolate(
        txt(urlDate > today ? 'statusOnDate_future' : 'statusOnDate_past'),
        { date: formatDate(urlDate) },
      )}
    </small>
  )

  const getNextHistoryDate = () => {
    const idx = (history || []).findIndex((item) => item.date === timelineDate)
    const nextItem = idx > -1 && history[idx + 1]
    return nextItem ? nextItem.date : undefined
  }

  const renderLinkToCurrent = () => {
    const textKey = repealed ? 'statusLinkToRepealed' : 'statusLinkToCurrent'
    const labelKey = repealed
      ? 'statusLinkToRepealed_long'
      : 'statusLinkToCurrent_long'
    return (
      <small className={s.toCurrent}>
        <Link
          className={s.linkToCurrent}
          href={linkToRegulation(name)}
          aria-label={txt(labelKey)}
        >
          {txt(textKey)}
        </Link>
      </small>
    )
  }

  const isOgildWAT = repealed && !repealedDate // Don't ask. Magic data!

  const futureDateTo =
    timelineDate && timelineDate > today && getNextHistoryDate()

  return (
    <>
      <div className={s.printText}>
        <Text>
          {txt('printedDate')} {formatDate(today)}
        </Text>
      </div>
      <div className={s.statusText}>
        <Ball type={color} />

        {!timelineDate || timelineDate === (lastAmendDate || publishedDate) ? (
          repealedDate ? (
            <>
              {txt('statusRepealed') + ' '}
              {onDateText || (
                <small className={s.metaDate}>
                  {interpolate(txt('statusRepealed_on'), {
                    date: formatDate(repealedDate),
                  })}
                </small>
              )}
            </>
          ) : isOgildWAT ? (
            <>
              {txt('statusOgildWat') + ' '}
              {onDateText ||
                (lastAmendDate && (
                  <small className={s.metaDate}>
                    {interpolate(txt('statusCurrent_amended'), {
                      date: formatDate(lastAmendDate),
                    })}
                  </small>
                ))}
            </>
          ) : !lastAmendDate ? (
            <>
              {txt(
                type === 'base' ? 'statusCurrentBase' : 'statusCurrentAmending',
              ) + ' '}
              {onDateText}
            </>
          ) : (
            <>
              {txt('statusCurrentUpdated') + ' '}
              {onDateText ||
                (lastAmendDate && (
                  <small className={s.metaDate}>
                    {interpolate(txt('statusCurrent_amended'), {
                      date: formatDate(lastAmendDate),
                    })}
                  </small>
                ))}
            </>
          )
        ) : timelineDate > today ? (
          <>
            {txt('statusUpcoming') + ' '}
            {onDateText || (
              <small className={s.metaDate}>
                {!futureDateTo
                  ? interpolate(txt('statusUpcoming_on'), {
                      date: formatDate(timelineDate),
                    })
                  : interpolate(txt('statusUpcoming_period'), {
                      dateFrom: formatDate(timelineDate),
                      dateTo: futureDateTo,
                    })}
              </small>
            )}{' '}
            {renderLinkToCurrent()}
          </>
        ) : (
          <>
            {txt(
              timelineDate === publishedDate
                ? 'statusOriginal'
                : 'statusHistoric',
            ) + ' '}
            {onDateText || (
              <small className={s.metaDate}>
                {interpolate(txt('statusHistoric_period'), {
                  dateFrom: formatDate(timelineDate),
                  dateTo: formatDate(getNextHistoryDate() || today),
                })}
              </small>
            )}{' '}
            {renderLinkToCurrent()}
          </>
        )}
      </div>
    </>
  )
}
