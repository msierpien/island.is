import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text, Input, Checkbox } from '@island.is/island-ui/core'
import {
  formatAccusedByGender,
  formatDate,
  NounCases,
} from '@island.is/judicial-system/formatters'
import {
  CaseCustodyRestrictions,
  CaseType,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  DateTime,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import CheckboxList from '@island.is/judicial-system-web/src/components/CheckboxList/CheckboxList'
import {
  legalProvisions,
  travelBanProvisions,
} from '@island.is/judicial-system-web/src/utils/laws'
import {
  alternativeTravelBanRestrictions,
  restrictions,
} from '@island.is/judicial-system-web/src/utils/Restrictions'
import { isPoliceDemandsStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { rcDemands } from '@island.is/judicial-system-web/messages/RestrictionCases/Prosecutor/demandsForm'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  requestedValidToDateIsValid: boolean
  setRequestedValidToDateIsValid: React.Dispatch<React.SetStateAction<boolean>>
}

const StepThreeForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, setRequestedValidToDateIsValid } = props
  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] = useState<string>(
    '',
  )

  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcDemands.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(rcDemands.sections.demands.heading)}
            </Text>
            {workingCase.parentCase && (
              <Box marginTop={1}>
                <Text>
                  {`${
                    workingCase.type === CaseType.CUSTODY
                      ? 'Fyrri gæsla'
                      : 'Fyrra farbann'
                  } var/er til `}
                  <Text as="span" fontWeight="semiBold">
                    {formatDate(
                      workingCase.parentCase.validToDate,
                      'PPPPp',
                    )?.replace('dagur,', 'dagsins')}
                  </Text>
                </Text>
              </Box>
            )}
          </Box>
          <BlueBox>
            <Box marginBottom={workingCase.type === CaseType.CUSTODY ? 3 : 0}>
              <DateTime
                name="reqValidToDate"
                datepickerLabel={`${
                  workingCase.type === CaseType.CUSTODY
                    ? 'Gæsluvarðhald'
                    : 'Farbann'
                } til`}
                minDate={new Date()}
                selectedDate={
                  workingCase.requestedValidToDate
                    ? new Date(workingCase.requestedValidToDate)
                    : undefined
                }
                onChange={(date: Date | undefined, valid: boolean) => {
                  newSetAndSendDateToServer(
                    'requestedValidToDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    setRequestedValidToDateIsValid,
                    updateCase,
                  )
                }}
                required
                blueBox={false}
              />
            </Box>
            {workingCase.type === CaseType.CUSTODY && (
              <Checkbox
                name="isIsolation"
                label={formatMessage(rcDemands.sections.demands.isolation)}
                tooltip={formatMessage(rcDemands.sections.demands.tooltip)}
                checked={workingCase.requestedCustodyRestrictions?.includes(
                  CaseCustodyRestrictions.ISOLATION,
                )}
                onChange={() =>
                  setCheckboxAndSendToServer(
                    'requestedCustodyRestrictions',
                    'ISOLATION',
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
                large
                filled
              />
            )}
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(rcDemands.sections.lawsBroken.heading)}
            </Text>
          </Box>
          <Input
            data-testid="lawsBroken"
            name="lawsBroken"
            label={formatMessage(rcDemands.sections.lawsBroken.label, {
              defendant: formatAccusedByGender(
                workingCase?.accusedGender,
                NounCases.GENITIVE,
              ),
            })}
            placeholder={formatMessage(
              rcDemands.sections.lawsBroken.placeholder,
            )}
            value={workingCase.lawsBroken || ''}
            errorMessage={lawsBrokenErrorMessage}
            hasError={lawsBrokenErrorMessage !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'lawsBroken',
                event,
                ['empty'],
                workingCase,
                setWorkingCase,
                lawsBrokenErrorMessage,
                setLawsBrokenErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'lawsBroken',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setLawsBrokenErrorMessage,
              )
            }
            required
            textarea
            rows={7}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(rcDemands.sections.legalBasis.heading)}{' '}
              <Text as="span" color={'red600'} fontWeight="semiBold">
                *
              </Text>
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={2}>
              <CheckboxList
                checkboxes={
                  workingCase.type === CaseType.CUSTODY
                    ? legalProvisions
                    : travelBanProvisions
                }
                selected={workingCase.legalProvisions}
                onChange={(id) =>
                  setCheckboxAndSendToServer(
                    'legalProvisions',
                    id,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
              />
            </Box>
            <Input
              data-testid="legalBasis"
              name="legalBasis"
              label={formatMessage(
                rcDemands.sections.legalBasis.legalBasisLabel,
              )}
              placeholder={formatMessage(
                rcDemands.sections.legalBasis.legalBasisPlaceholder,
              )}
              value={workingCase.legalBasis || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalBasis',
                  event,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'legalBasis',
                  event.target.value,
                  [],
                  workingCase,
                  updateCase,
                )
              }
              textarea
              rows={7}
            />
          </BlueBox>
        </Box>
        {workingCase.type === CaseType.CUSTODY && (
          <Box component="section" marginBottom={10}>
            <Box marginBottom={3}>
              <Box marginBottom={1}>
                <Text as="h3" variant="h3">
                  {formatMessage(
                    rcDemands.sections.custodyRestrictions.heading,
                    {
                      caseType: 'gæslu',
                    },
                  )}
                </Text>
              </Box>
              <Text>
                {formatMessage(
                  rcDemands.sections.custodyRestrictions.subHeading,
                  {
                    caseType: 'gæsla',
                  },
                )}
              </Text>
            </Box>
            <BlueBox>
              <CheckboxList
                checkboxes={restrictions}
                selected={workingCase.requestedCustodyRestrictions}
                onChange={(id) =>
                  setCheckboxAndSendToServer(
                    'requestedCustodyRestrictions',
                    id,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
              />
            </BlueBox>
          </Box>
        )}
        {workingCase.type === CaseType.TRAVEL_BAN && (
          <Box component="section" marginBottom={4}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(rcDemands.sections.custodyRestrictions.heading, {
                  caseType: 'farbanns',
                })}
              </Text>
              <Text>
                {formatMessage(
                  rcDemands.sections.custodyRestrictions.subHeading,
                  {
                    caseType: 'farbann',
                  },
                )}
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={3}>
                <CheckboxList
                  checkboxes={alternativeTravelBanRestrictions}
                  selected={workingCase.requestedCustodyRestrictions}
                  onChange={(id) =>
                    setCheckboxAndSendToServer(
                      'requestedCustodyRestrictions',
                      id,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }
                />
              </Box>
              <Input
                name="requestedOtherRestrictions"
                data-testid="requestedOtherRestrictions"
                label={formatMessage(
                  rcDemands.sections.custodyRestrictions.label,
                )}
                value={workingCase.requestedOtherRestrictions || ''}
                placeholder={formatMessage(
                  rcDemands.sections.custodyRestrictions.placeholder,
                )}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'requestedOtherRestrictions',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'requestedOtherRestrictions',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                rows={10}
                textarea
              />
            </BlueBox>
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_TWO_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isPoliceDemandsStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </>
  )
}

export default StepThreeForm
