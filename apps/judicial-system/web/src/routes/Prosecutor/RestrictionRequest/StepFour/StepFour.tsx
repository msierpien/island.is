import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Text, Box, Input, Tooltip } from '@island.is/island-ui/core'
import {
  CaseCustodyRestrictions,
  CaseType,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { isPoliceReportStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  FormFooter,
  PageLayout,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { rcReportForm } from '@island.is/judicial-system-web/messages'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const StepFour: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [demandsErrorMessage, setDemandsErrorMessage] = useState<string>('')
  const [caseFactsErrorMessage, setCaseFactsErrorMessage] = useState<string>('')
  const [
    legalArgumentsErrorMessage,
    setLegalArgumentsErrorMessage,
  ] = useState<string>('')

  const { formatMessage } = useIntl()
  const router = useRouter()
  const id = router.query.id

  const { updateCase, autofill } = useCase()

  useEffect(() => {
    document.title = 'Greinargerð - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const theCase: Case = workingCase

    autofill(
      'demands',
      `${formatMessage(rcReportForm.sections.demands.autofill, {
        accusedName: theCase.accusedName,
        accusedNationalId: formatNationalId(theCase.accusedNationalId),
        extensionSuffix:
          theCase.parentCase &&
          isAcceptingCaseDecision(theCase.parentCase.decision)
            ? ' áframhaldandi'
            : '',
        caseType:
          theCase.type === CaseType.CUSTODY ? 'gæsluvarðhaldi' : 'farbanni',
        court: theCase.court?.name.replace('Héraðsdómur', 'Héraðsdóms'),
        requestedValidToDate: formatDate(theCase.requestedValidToDate, 'PPPPp')
          ?.replace('dagur,', 'dagsins')
          ?.replace(' kl.', ', kl.'),
        isolationSuffix:
          theCase.type === CaseType.CUSTODY &&
          theCase.requestedCustodyRestrictions?.includes(
            CaseCustodyRestrictions.ISOLATION,
          )
            ? ', og verði gert að sæta einangrun á meðan á varðhaldi stendur'
            : '',
      })}`,
      theCase,
    )

    if (workingCase.id !== '') {
      setWorkingCase(theCase)
    }
  }, [workingCase.id])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_FOUR}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <FormContentContainer>
        <Box marginBottom={10}>
          <Text as="h1" variant="h1">
            {formatMessage(rcReportForm.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={4}>
            <Text as="h3" variant="h3">
              {formatMessage(rcReportForm.sections.demands.heading)}{' '}
              <Tooltip
                text={formatMessage(rcReportForm.sections.demands.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              name="demands"
              label={formatMessage(rcReportForm.sections.demands.label)}
              placeholder={formatMessage(
                rcReportForm.sections.demands.placeholder,
              )}
              value={workingCase.demands || ''}
              errorMessage={demandsErrorMessage}
              hasError={demandsErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'demands',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  demandsErrorMessage,
                  setDemandsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'demands',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setDemandsErrorMessage,
                )
              }
              rows={7}
              textarea
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(rcReportForm.sections.caseFacts.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(rcReportForm.sections.caseFacts.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="caseFacts"
              name="caseFacts"
              label={formatMessage(rcReportForm.sections.caseFacts.label)}
              placeholder={formatMessage(
                rcReportForm.sections.caseFacts.placeholder,
              )}
              errorMessage={caseFactsErrorMessage}
              hasError={caseFactsErrorMessage !== ''}
              value={workingCase.caseFacts || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFacts',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  caseFactsErrorMessage,
                  setCaseFactsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'caseFacts',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCaseFactsErrorMessage,
                )
              }
              required
              rows={14}
              textarea
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(rcReportForm.sections.legalArguments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(
                  rcReportForm.sections.legalArguments.tooltip,
                )}
              />
            </Text>
          </Box>
          <Box marginBottom={7}>
            <Input
              data-testid="legalArguments"
              name="legalArguments"
              label={formatMessage(rcReportForm.sections.legalArguments.label)}
              placeholder={formatMessage(
                rcReportForm.sections.legalArguments.placeholder,
              )}
              value={workingCase.legalArguments || ''}
              errorMessage={legalArgumentsErrorMessage}
              hasError={legalArgumentsErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalArguments',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  legalArgumentsErrorMessage,
                  setLegalArgumentsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'legalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLegalArgumentsErrorMessage,
                )
              }
              required
              textarea
              rows={14}
            />
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                {formatMessage(rcReportForm.sections.comments.heading)}{' '}
                <Tooltip
                  placement="right"
                  as="span"
                  text={formatMessage(rcReportForm.sections.comments.tooltip)}
                />
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Input
                name="comments"
                label={formatMessage(rcReportForm.sections.comments.label)}
                placeholder={formatMessage(
                  rcReportForm.sections.comments.placeholder,
                )}
                value={workingCase.comments || ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'comments',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'comments',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                textarea
                rows={7}
              />
            </Box>
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_THREE_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.STEP_FIVE_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isPoliceReportStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default StepFour
