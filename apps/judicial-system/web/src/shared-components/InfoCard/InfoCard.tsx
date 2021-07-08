import { Box, Text } from '@island.is/island-ui/core'
import { formatNationalId } from '@island.is/judicial-system/formatters'
import { Accused } from '@island.is/judicial-system/types'
import React, { PropsWithChildren } from 'react'
import * as styles from './InfoCard.treat'

interface Props {
  data: Array<{ title: string; value?: string }>
  accused: Accused[]
  defender?: { name: string; email?: string; phoneNumber?: string }
  isInvestigationCase?: boolean
}

const InfoCard: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  return (
    <Box className={styles.infoCardContainer} data-testid="infoCard">
      <Text variant="h4">
        {props.isInvestigationCase
          ? props.accused.length > 1
            ? 'Varnaraðilar'
            : 'Varnaraðili'
          : 'Sakborningur'}
      </Text>
      <Box className={styles.infoCardTitleContainer}>
        <Box marginBottom={4}>
          {props.accused.map((accused) => (
            <Text fontWeight="semiBold">
              {accused.name}
              <Text as="span">{`, `}</Text>
              {`kt. ${formatNationalId(accused.nationalId ?? '')}`}
              <Text as="span">{`, ${accused.address}`}</Text>
            </Text>
          ))}
        </Box>
        <Box>
          <Text variant="h4">Verjandi</Text>
          {props.defender?.name ? (
            <Box display="flex">
              <Text>
                {`${props.defender.name}${
                  props.defender.email ? `, ${props.defender.email}` : ''
                }${
                  props.defender.phoneNumber
                    ? `, s. ${props.defender.phoneNumber}`
                    : ''
                }`}
              </Text>
            </Box>
          ) : (
            <Text>Hefur ekki verið skráður</Text>
          )}
        </Box>
      </Box>
      <Box className={styles.infoCardDataContainer}>
        {props.data.map((dataItem, index) => (
          <Box
            data-testid={`infoCardDataContainer${index}`}
            className={styles.infoCardData}
            // Should be applied to every element except the last two
            marginBottom={index < props.data.length - 2 ? 3 : 0}
            key={index}
          >
            <Text variant="h4">{dataItem.title}</Text>
            <Text>{dataItem.value}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default InfoCard
