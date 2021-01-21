import { Box, Text } from '@island.is/island-ui/core'
import { formatNationalId } from '@island.is/judicial-system/formatters'
import React, { PropsWithChildren } from 'react'
import * as styles from './InfoCard.treat'

interface Props {
  data: Array<{ title: string; value?: string }>
  accusedName?: string
  accusedNationalId?: string
  accusedAddress?: string
}

const InfoCard: React.FC<Props> = (props: PropsWithChildren<Props>) => {
  return (
    <Box className={styles.infoCardContainer}>
      <Text variant="h4">Sakborningur</Text>
      <Box className={styles.infoCardTitleContainer}>
        <Text fontWeight="semiBold">
          {`${props.accusedName}, kt. ${formatNationalId(
            props.accusedNationalId || '',
          )}, `}
          <Text as="span">{props.accusedAddress}</Text>
        </Text>
      </Box>
      <Box className={styles.infoCardDataContainer}>
        {props.data.map((dataItem, index) => (
          <Box
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
