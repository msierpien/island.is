import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  FormFooter,
  CourtDocuments,
  PageLayout,
  CaseNumbers,
  BlueBox,
  FormContentContainer,
  DateTime,
  HideableText,
} from '@island.is/judicial-system-web/src/components'
import {
  caseTypes,
  formatAccusedByGender,
  NounCases,
} from '@island.is/judicial-system/formatters'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  rcCourtRecord as m,
  closedCourt,
} from '@island.is/judicial-system-web/messages'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import { isCourtRecordStepValidRC } from '../../../../utils/validate'

export const CourtRecord: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [, setCourtRecordStartDateIsValid] = useState(true)
  const [courtLocationErrorMessage, setCourtLocationMessage] = useState('')
  const [
    litigationPresentationsErrorMessage,
    setLitigationPresentationsMessage,
  ] = useState('')

  const router = useRouter()
  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()

  const id = router.query.id

  useEffect(() => {
    document.title = 'Þingbók - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const defaultCourtAttendees = (wc: Case): string => {
      let attendees = ''

      if (wc.prosecutor && wc.accusedName) {
        attendees += `${wc.prosecutor.name} ${wc.prosecutor.title}\n${
          wc.accusedName
        } ${formatAccusedByGender(wc?.accusedGender)}`
      }

      if (wc.defenderName) {
        attendees += `\n${
          wc.defenderName
        } skipaður verjandi ${formatAccusedByGender(
          wc?.accusedGender,
          NounCases.GENITIVE,
        )}`
      }

      if (wc.translator) {
        attendees += `\n${wc.translator} túlkur`
      }

      return attendees
    }

    const theCase = workingCase

    if (theCase.courtDate) {
      autofill('courtStartDate', theCase.courtDate, theCase)
    }

    if (theCase.court) {
      autofill(
        'courtLocation',
        `í ${
          theCase.court.name.indexOf('dómur') > -1
            ? theCase.court.name.replace('dómur', 'dómi')
            : theCase.court.name
        }`,
        theCase,
      )
    }

    if (theCase.courtAttendees !== '') {
      autofill('courtAttendees', defaultCourtAttendees(theCase), theCase)
    }

    if (theCase.type === CaseType.CUSTODY) {
      autofill(
        'litigationPresentations',
        `Sækjandi ítrekar kröfu um gæsluvarðhald, reifar og rökstyður kröfuna og leggur málið í úrskurð með venjulegum fyrirvara.\n\nVerjandi ${formatAccusedByGender(
          theCase.accusedGender,
          NounCases.GENITIVE,
        )} ítrekar mótmæli hans, krefst þess að kröfunni verði hafnað, til vara að ${formatAccusedByGender(
          theCase.accusedGender,
          NounCases.DATIVE,
        )} verði gert að sæta farbanni í stað gæsluvarðhalds, en til þrautavara að gæsluvarðhaldi verði markaður skemmri tími en krafist er og að ${formatAccusedByGender(
          theCase.accusedGender,
          NounCases.DATIVE,
        )} verði ekki gert að sæta einangrun á meðan á gæsluvarðhaldi stendur. Verjandinn reifar og rökstyður mótmælin og leggur málið í úrskurð með venjulegum fyrirvara.`,
        theCase,
      )
    }

    let autofillAccusedBookings = ''

    if (theCase.defenderName) {
      autofillAccusedBookings += `${formatMessage(
        m.sections.accusedBookings.autofillDefender,
        {
          defender: theCase.defenderName,
        },
      )}\n\n`
    }

    if (theCase.translator) {
      autofillAccusedBookings += `${formatMessage(
        m.sections.accusedBookings.autofillTranslator,
        {
          translator: theCase.translator,
        },
      )}\n\n`
    }

    autofillAccusedBookings += `${formatMessage(
      m.sections.accusedBookings.autofillRightToRemainSilent,
    )}\n\n${formatMessage(
      m.sections.accusedBookings.autofillCourtDocumentOne,
    )}\n\n${formatMessage(m.sections.accusedBookings.autofillAccusedPlea)}`

    autofill('accusedBookings', autofillAccusedBookings, theCase)

    if (workingCase.id !== '') {
      setWorkingCase(theCase)
    }
  }, [workingCase.id])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <FormContentContainer>
        <Box marginBottom={10}>
          <Text as="h1" variant="h1">
            Þingbók
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={3}>
          <BlueBox>
            <Box marginBottom={3}>
              <DateTime
                name="courtStartDate"
                datepickerLabel="Dagsetning þinghalds"
                timeLabel="Þinghald hófst (kk:mm)"
                maxDate={new Date()}
                selectedDate={
                  workingCase.courtStartDate
                    ? new Date(workingCase.courtStartDate)
                    : new Date()
                }
                onChange={(date: Date | undefined, valid: boolean) => {
                  newSetAndSendDateToServer(
                    'courtStartDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    setCourtRecordStartDateIsValid,
                    updateCase,
                  )
                }}
                blueBox={false}
                required
              />
            </Box>
            <Input
              data-testid="courtLocation"
              name="courtLocation"
              tooltip={formatMessage(m.sections.courtLocation.tooltip)}
              label={formatMessage(m.sections.courtLocation.label)}
              value={workingCase.courtLocation || ''}
              placeholder={formatMessage(m.sections.courtLocation.placeholder)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLocation',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtLocationErrorMessage,
                  setCourtLocationMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLocation',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLocationMessage,
                )
              }
              errorMessage={courtLocationErrorMessage}
              hasError={courtLocationErrorMessage !== ''}
              autoComplete="off"
              required
            />
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={3}>
            <HideableText
              text={formatMessage(closedCourt.text)}
              isHidden={workingCase.isClosedCourtHidden}
              onToggleVisibility={(isVisible: boolean) =>
                setAndSendToServer(
                  'isClosedCourtHidden',
                  isVisible,
                  workingCase,
                  setWorkingCase,
                  updateCase,
                )
              }
              tooltip={formatMessage(closedCourt.tooltip)}
            />
          </Box>
          <Input
            data-testid="courtAttendees"
            name="courtAttendees"
            label="Mættir eru"
            value={workingCase.courtAttendees || ''}
            placeholder="Skrifa hér..."
            onChange={(event) =>
              removeTabsValidateAndSet(
                'courtAttendees',
                event,
                ['empty'],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              updateCase(
                workingCase.id,
                parseString('courtAttendees', event.target.value),
              )
            }
            textarea
            rows={7}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Dómskjöl
            </Text>
          </Box>
          <CourtDocuments
            title={`Krafa um ${caseTypes[workingCase.type]}`}
            tagText="Þingmerkt nr. 1"
            tagVariant="darkerBlue"
            text="Rannsóknargögn málsins liggja frammi."
            caseId={workingCase.id}
            selectedCourtDocuments={workingCase.courtDocuments ?? []}
            onUpdateCase={updateCase}
            setWorkingCase={setWorkingCase}
            workingCase={workingCase}
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={1}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.accusedBookings.title, {
                genderedAccused: formatAccusedByGender(
                  workingCase.accusedGender,
                  NounCases.GENITIVE,
                ),
              })} `}
              <Tooltip
                text={formatMessage(m.sections.accusedBookings.tooltip)}
              />
            </Text>
          </Box>
          <Input
            data-testid="accusedBookings"
            name="accusedBookings"
            label={formatMessage(m.sections.accusedBookings.label, {
              genderedAccused: formatAccusedByGender(
                workingCase.accusedGender,
                NounCases.GENITIVE,
              ),
            })}
            value={workingCase.accusedBookings || ''}
            placeholder={formatMessage(m.sections.accusedBookings.placeholder)}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'accusedBookings',
                event,
                [],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'accusedBookings',
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
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Málflutningur
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="litigationPresentations"
              name="litigationPresentations"
              label="Málflutningur og aðrar bókanir"
              value={workingCase.litigationPresentations || ''}
              placeholder="Málflutningsræður og annað sem fram kom í þinghaldi er skráð hér..."
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'litigationPresentations',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  litigationPresentationsErrorMessage,
                  setLitigationPresentationsMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'litigationPresentations',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLitigationPresentationsMessage,
                )
              }
              errorMessage={litigationPresentationsErrorMessage}
              hasError={litigationPresentationsErrorMessage !== ''}
              textarea
              rows={7}
              required
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.RULING_STEP_ONE_ROUTE}/${id}`}
          nextIsDisabled={!isCourtRecordStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CourtRecord
