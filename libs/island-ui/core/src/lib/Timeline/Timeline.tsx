import React, { useState, useRef, useEffect } from 'react'
import cn from 'classnames'

import * as timelineStyles from './Timeline.treat'
import * as eventBarStyles from './EventBar.treat'
import { Icon } from '../..'

/* eslint-disable-next-line */
export interface TimelineProps {}

const renderValue = (value) =>
  value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

const months = [
  'Janúar',
  'Febrúar',
  'Mars',
  'Apríl',
  'Maí',
  'Júní',
  'Júlí',
  'Ágúst',
  'September',
  'Oktober',
  'Nóvember',
  'Desember',
]

const initialState = [
  {
    date: new Date('05/05/2019'),
    title: 'Rásfundur: 5 teymi',
  },
  {
    date: new Date('04/08/2019'),
    title: 'Ytri vefur: BETA',
  },
  {
    date: new Date('04/04/2019'),
    title: 'Ferðagjöf',
    value: 36788,
    maxValue: 242767,
    valueLabel: 'Sóttar ferðagjafir',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      markup: `
      <p>Ferðagjöfin er liður í að efla íslenska ferðaþjónustu
      í kjölfar kórónuveirufaraldurs og er ætlað að hvetja
      landsmenn til að ferðast innanlands.</p>

      <h3>Þú færð allar upplýsingar um Ferðagjöfina á ferdalag.is.</h3>

      <p>Allir einstaklingar með lögheimili á Íslandi, fæddir árið
      2002 eða fyrr, fá Ferðagjöf að andvirði 5.000 kr. Gildistími
      Ferðagjafarinnar er til og með 31. desember 2020.</p>`,
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('04/23/2019'),
    title: 'Eitthvað sniðugt: OMEGA',
  },
  {
    date: new Date('03/09/2018'),
    title: 'Margt gerðist hér!',
  },
  {
    date: new Date('03/10/2018'),
    title: 'Meira hér!',
  },
  {
    date: new Date('05/05/2017'),
    title: 'Rásfundur: 5 teymi',
  },
  {
    date: new Date('04/08/2017'),
    title: 'Ytri vefur: BETA',
  },
  {
    date: new Date('04/04/2017'),
    title: 'Ferðagjöf',
    value: 36788,
    maxValue: 242767,
    valueLabel: 'Sóttar ferðagjafir',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      markup: `
      <p>Ferðagjöfin er liður í að efla íslenska ferðaþjónustu
      í kjölfar kórónuveirufaraldurs og er ætlað að hvetja
      landsmenn til að ferðast innanlands.</p>

      <h3>Þú færð allar upplýsingar um Ferðagjöfina á ferdalag.is.</h3>

      <p>Allir einstaklingar með lögheimili á Íslandi, fæddir árið
      2002 eða fyrr, fá Ferðagjöf að andvirði 5.000 kr. Gildistími
      Ferðagjafarinnar er til og með 31. desember 2020.</p>`,
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('02/02/2020'),
    title: 'Viðspyrna',
    data: {
      labels: ['Parallel', 'Kosmos & Kaos', 'YAY', 'Andes'],
      markup: `
      <p>Ferðagjöfin er liður í að efla íslenska ferðaþjónustu
      í kjölfar kórónuveirufaraldurs og er ætlað að hvetja
      landsmenn til að ferðast innanlands.</p>

      <h3>Þú færð allar upplýsingar um Ferðagjöfina á ferdalag.is.</h3>

      <p>Allir einstaklingar með lögheimili á Íslandi, fæddir árið
      2002 eða fyrr, fá Ferðagjöf að andvirði 5.000 kr. Gildistími
      Ferðagjafarinnar er til og með 31. desember 2020.</p>`,
      link: 'https://frettabladid.overcastcdn.com/documents/200626.pdf',
    },
  },
  {
    date: new Date('04/23/2017'),
    title: 'Eitthvað sniðugt: OMEGA',
  },
  {
    date: new Date('03/09/2016'),
    title: 'Margt gerðist hér!',
  },
  {
    date: new Date('03/10/2016'),
    title: 'Meira hér!',
  },
].sort((a, b) => b.date.getTime() - a.date.getTime())

export const Timeline = (props: TimelineProps) => {
  const frameRef = useRef<HTMLDivElement>(null)
  const [events, setEvents] = useState(initialState)

  const usableYears = events.reduce((usableYears, item) => {
    const eventYear = item.date.getFullYear()

    if (usableYears.indexOf(eventYear) < 0) {
      usableYears.push(eventYear)
    }

    return usableYears
  }, [])

  const getUsableMonthsInYear = (year) =>
    events.reduce((usableMonths, item) => {
      const eventYear = item.date.getFullYear()

      if (eventYear === year) {
        const month = item.date.getMonth()

        if (usableMonths.indexOf(month) < 0) {
          usableMonths.push(month)
        }
      }

      return usableMonths
    }, [])

  const getUsableEventsInMonthAndYear = (year, month) =>
    events.filter(
      (event) =>
        event.date.getFullYear() === year && event.date.getMonth() === month,
    )

  return (
    <div className={timelineStyles.container}>
      <ArrowButton type="prev" />
      <ArrowButton type="next" />
      <div ref={frameRef} className={timelineStyles.frame}>
        <div className={timelineStyles.innerContainer}>
          {usableYears.map((year, index) => {
            const usableMonths = getUsableMonthsInYear(year)

            return (
              <div key={index} className={timelineStyles.yearContainer}>
                <div className={timelineStyles.section}>
                  <div className={timelineStyles.left}>
                    <span
                      className={cn(
                        timelineStyles.year,
                        timelineStyles.leftLabel,
                      )}
                    >
                      {year}
                    </span>
                  </div>
                  <div className={timelineStyles.right}>&nbsp;</div>
                </div>
                {usableMonths.map((month, index) => {
                  const usableEvents = getUsableEventsInMonthAndYear(
                    year,
                    month,
                  )

                  return (
                    <div key={index} className={timelineStyles.monthContainer}>
                      <div className={timelineStyles.section}>
                        <div className={timelineStyles.left}>
                          <span
                            className={cn(
                              timelineStyles.month,
                              timelineStyles.leftLabel,
                            )}
                          >
                            {months[month]}
                          </span>
                        </div>
                        <div className={timelineStyles.right}>&nbsp;</div>
                      </div>

                      <div className={timelineStyles.section}>
                        <div className={timelineStyles.left}>&nbsp;</div>
                        <div className={timelineStyles.right}>
                          <div className={timelineStyles.eventsContainer}>
                            {usableEvents.map((event, index) => {
                              const larger = Boolean(event.data)

                              return (
                                <div
                                  key={index}
                                  className={timelineStyles.eventWrapper}
                                >
                                  <span
                                    className={cn(timelineStyles.bulletLine, {
                                      [timelineStyles.bulletLineLarger]: larger,
                                    })}
                                  >
                                    <BulletLine />
                                  </span>
                                  {larger ? (
                                    <EventBar {...event} />
                                  ) : (
                                    <div className={timelineStyles.event}>
                                      {event.title}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const EventBar = (event) => {
  return (
    <div className={eventBarStyles.eventBar}>
      <div className={eventBarStyles.eventBarTitle}>
        <div className={eventBarStyles.eventBarIcon}>
          <Icon type="user" color="purple400" width="24" />
        </div>
        <span className={eventBarStyles.title}>{event.title}</span>
      </div>
      {event.value && (
        <div className={eventBarStyles.eventBarStats}>
          <span className={eventBarStyles.valueWrapper}>
            <span className={eventBarStyles.value}>
              {renderValue(event.value)}
            </span>
            <span className={eventBarStyles.maxValue}>
              /{renderValue(event.maxValue)}
            </span>
          </span>
          <span className={eventBarStyles.valueLabel}>{event.valueLabel}</span>
        </div>
      )}
    </div>
  )
}

const BulletLine = ({ selected = false }: { selected?: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="126"
      height="24"
      fill="none"
      viewBox="0 0 126 24"
    >
      <path
        fill={selected ? '#ff0050' : '#99c0ff'}
        fillRule="evenodd"
        d="M118.126 13A4.002 4.002 0 00126 12a4 4 0 00-8 0H24c0-6.627-5.373-12-12-12S0 5.373 0 12s5.373 12 12 12c6.29 0 11.45-4.84 11.959-11h94.167zM8 12a4 4 0 108 0 4 4 0 00-8 0z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

type ArrowButtonTypes = 'prev' | 'next'

interface ArrowButtonProps {
  type: ArrowButtonTypes
}

const ArrowButton = ({ type = 'prev' }: ArrowButtonProps) => {
  return (
    <button
      className={cn(
        timelineStyles.arrowButton,
        timelineStyles.arrowButtonTypes[type],
      )}
    >
      <Icon type="arrowLeft" color="blue400" width="15" />
    </button>
  )
}

export default Timeline
