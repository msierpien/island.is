import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  CaseFileList,
  CaseNumbers,
  Decision,
  FormContentContainer,
  FormFooter,
  PoliceRequestAccordionItem,
  RulingInput,
} from '@island.is/judicial-system-web/src/components'
import {
  Accordion,
  AccordionItem,
  Box,
  Input,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isRulingStepOneValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { icRulingStepOne as m } from '@island.is/judicial-system-web/messages'
import type { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoading: boolean
}

const RulingStepOneForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const { user } = useContext(UserContext)
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  const [courtCaseFactsEM, setCourtCaseFactsEM] = useState<string>('')
  const [courtLegalArgumentsEM, setCourtLegalArgumentsEM] = useState<string>('')
  const [prosecutorDemandsEM, setProsecutorDemandsEM] = useState('')

  const validations: FormSettings = {
    prosecutorDemands: {
      validations: ['empty'],
    },
    ruling: {
      validations: ['empty'],
    },
    courtCaseFacts: {
      validations: ['empty'],
    },
    courtLegalArguments: {
      validations: ['empty'],
    },
  }

  useCaseFormHelper(workingCase, setWorkingCase, validations)

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Accordion>
            <PoliceRequestAccordionItem workingCase={workingCase} />
            <AccordionItem
              id="caseFileList"
              label={`Rannsóknargögn (${workingCase.caseFiles?.length ?? 0})`}
              labelVariant="h3"
            >
              <CaseFileList
                caseId={workingCase.id}
                files={workingCase.caseFiles ?? []}
                canOpenFiles={
                  workingCase.judge !== null &&
                  workingCase.judge?.id === user?.id
                }
              />
            </AccordionItem>
          </Accordion>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.prosecutorDemands.title)}
            </Text>
          </Box>
          <Input
            data-testid="prosecutorDemands"
            name="prosecutorDemands"
            label={formatMessage(m.sections.prosecutorDemands.label)}
            value={workingCase.prosecutorDemands || ''}
            placeholder={formatMessage(m.sections.prosecutorDemands.label)}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'prosecutorDemands',
                event,
                ['empty'],
                workingCase,
                setWorkingCase,
                prosecutorDemandsEM,
                setProsecutorDemandsEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'prosecutorDemands',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setProsecutorDemandsEM,
              )
            }
            errorMessage={prosecutorDemandsEM}
            hasError={prosecutorDemandsEM !== ''}
            textarea
            rows={7}
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.courtCaseFacts.title)} `}
              <Tooltip
                text={formatMessage(m.sections.courtCaseFacts.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="courtCaseFacts"
              name="courtCaseFacts"
              label={formatMessage(m.sections.courtCaseFacts.label)}
              value={workingCase.courtCaseFacts || ''}
              placeholder={formatMessage(m.sections.courtCaseFacts.placeholder)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtCaseFacts',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtCaseFactsEM,
                  setCourtCaseFactsEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtCaseFacts',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtCaseFactsEM,
                )
              }
              errorMessage={courtCaseFactsEM}
              hasError={courtCaseFactsEM !== ''}
              textarea
              rows={16}
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.courtLegalArguments.title)} `}
              <Tooltip
                text={formatMessage(m.sections.courtLegalArguments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="courtLegalArguments"
              name="courtLegalArguments"
              label={formatMessage(m.sections.courtLegalArguments.label)}
              value={workingCase.courtLegalArguments || ''}
              placeholder={formatMessage(
                m.sections.courtLegalArguments.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLegalArguments',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtLegalArgumentsEM,
                  setCourtLegalArgumentsEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLegalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLegalArgumentsEM,
                )
              }
              errorMessage={courtLegalArgumentsEM}
              hasError={courtLegalArgumentsEM !== ''}
              textarea
              rows={16}
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.decision.title)} `}
              <Text as="span" fontWeight="semiBold" color="red600">
                *
              </Text>
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Decision
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              acceptedLabelText={formatMessage(m.sections.decision.acceptLabel)}
              rejectedLabelText={formatMessage(m.sections.decision.rejectLabel)}
              partiallyAcceptedLabelText={formatMessage(
                m.sections.decision.partiallyAcceptLabel,
              )}
              dismissLabelText={formatMessage(m.sections.decision.dismissLabel)}
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.ruling.title)}
            </Text>
          </Box>
          <RulingInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isRequired
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.IC_RULING_STEP_TWO_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isRulingStepOneValidIC(workingCase)}
        />
      </FormContentContainer>
    </>
  )
}

export default RulingStepOneForm
