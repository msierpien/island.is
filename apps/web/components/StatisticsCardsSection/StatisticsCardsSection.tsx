import React from 'react'
import { GridContainer, Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { StatisticsCard, SimpleSlider } from '@island.is/web/components'

interface CardImageprops {
  title?: string
  url?: string
}
interface StatisticsCardProps {
  title?: string
  statistic?: string
  image?: CardImageprops
}

interface StatisticsSectionProps {
  title?: string
  cards?: StatisticsCardProps[]
}

export const StatisticsCardsSection = ({
  title,
  cards,
}: StatisticsSectionProps) => {
  return (
    <GridContainer>
      <Box marginTop={[4, 4, 10]}>
        <SimpleSlider
          title={title}
          breakpoints={{
            0: {
              gutterWidth: theme.grid.gutter.mobile,
              slideCount: 1,
            },
            [theme.breakpoints.sm]: {
              gutterWidth: theme.grid.gutter.mobile,
              slideCount: 2,
            },
            [theme.breakpoints.md]: {
              gutterWidth: theme.spacing[3],
              slideCount: 2,
            },
            [theme.breakpoints.lg]: {
              gutterWidth: theme.spacing[3],
              slideCount: 2,
            },
            [theme.breakpoints.xl]: {
              gutterWidth: theme.spacing[3],
              slideCount: 3,
            },
          }}
          items={cards.map(({ title, statistic, image }, index) => {
            return (
              <StatisticsCard
                key={index}
                title={title}
                description={statistic}
                image={{
                  title: image.title,
                  url: image.url,
                }}
              />
            )
          })}
          carouselController
          logo
        />
      </Box>
    </GridContainer>
  )
}

export default StatisticsCardsSection
