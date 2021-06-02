import React, { FC } from 'react'
import { Table as T } from '@island.is/island-ui/core'
import {
  FinanceStatusOrganizationType,
  FinanceStatusDetailsType,
} from '../../screens/FinanceStatus/FinanceStatusData.types'
import amountFormat from '../../utils/amountFormat'
import {
  Box,
  Text,
  Columns,
  Column,
  ArrowLink,
  Button,
} from '@island.is/island-ui/core'
import { exportGjoldSundurlidunCSV } from '../../utils/csvGjoldSundurlidun'
import * as styles from './FinanceStatusDetailTable.treat'

interface Props {
  organization: FinanceStatusOrganizationType
  financeStatusDetails: FinanceStatusDetailsType
}

const FinanceStatusDetailTable: FC<Props> = ({
  organization,
  financeStatusDetails,
}) => {
  const tableHeaderArray = [
    'Gjaldgrunnur',
    'Ár og tímabil',
    'Gjalddagi',
    'Eindagi',
    'Höfuðstóll',
    'Vextir',
    'Kostnaður',
    'Greiðslur',
    'Staða',
  ]
  return (
    <Box className={styles.wrapper} background="white">
      <T.Table>
        <T.Head>
          <T.Row>
            {tableHeaderArray.map((item, i) => (
              <T.HeadData key={i} text={{ truncate: true }}>
                <Text fontWeight="semiBold" variant="small">
                  {item}
                </Text>
              </T.HeadData>
            ))}
            <T.HeadData>
              <Box className={styles.buttonWrap}>
                <Button
                  circle
                  colorScheme="default"
                  icon="document"
                  iconType="filled"
                  onClick={function noRefCheck() {}}
                  preTextIconType="filled"
                  size="small"
                  title="Sækja Excel"
                  type="button"
                  variant="primary"
                />
                <Button
                  circle
                  colorScheme="default"
                  icon="reader"
                  iconType="filled"
                  onClick={() =>
                    exportGjoldSundurlidunCSV(
                      financeStatusDetails,
                      organization?.chargeTypes?.[0].name || 'details',
                    )
                  }
                  preTextIconType="filled"
                  size="small"
                  title="Sækja CSV"
                  type="button"
                  variant="primary"
                />
              </Box>
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {financeStatusDetails?.chargeItemSubjects?.map((row, i) => (
            <T.Row key={i}>
              {[
                row.chargeItemSubject,
                row.timePeriod,
                row.dueDate,
                row.finalDueDate,
                amountFormat(row.principal),
                amountFormat(row.interest),
                amountFormat(row.cost),
                amountFormat(row.paid),
                amountFormat(row.totals),
              ].map((item, ii) => (
                <T.Data key={ii}>
                  <div className={styles.td}>
                    <Text variant="small">{item}</Text>
                  </div>
                </T.Data>
              ))}
              <T.Data>
                {row.payID ? (
                  <Box className={styles.buttonTd} display="flex">
                    <ArrowLink href={`https://TODO_PAYMENT_LINK/${row.payID}`}>
                      Greiða
                    </ArrowLink>
                  </Box>
                ) : null}
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
      <Box padding={2} background="blue100">
        <Columns>
          <Column width="content">
            <Text fontWeight="semiBold" variant="small">
              Tengiliða upplýsingar
            </Text>
          </Column>
        </Columns>
        <Box>
          {organization.homepage && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="small" as="span">
                Heimasíða:
              </Text>{' '}
              <a href={`//${organization.homepage}`} target="_blank">
                <Text color="blue400" variant="small" as="span">
                  {organization.homepage}
                </Text>
              </a>
            </Box>
          )}
          {organization.email && (
            <Box display="inlineBlock" marginRight={2}>
              <Text variant="small" as="span">
                Netfang:
              </Text>{' '}
              <a href={`mailto:${organization.email}`} target="_blank">
                <Text color="blue400" variant="small" as="span">
                  {organization.email}
                </Text>
              </a>
            </Box>
          )}
          {/* TODO: Format tel display and href?? */}
          {organization.phone && (
            <Box display="inlineBlock">
              <Text variant="small" as="span">
                Sími:
              </Text>{' '}
              <a href={`tel:${organization.phone}`} target="_blank">
                <Text color="blue400" variant="small" as="span">
                  {organization.phone}
                </Text>
              </a>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default FinanceStatusDetailTable
