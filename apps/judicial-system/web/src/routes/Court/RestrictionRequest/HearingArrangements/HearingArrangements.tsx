import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ValueType } from 'react-select/src/types'

import {
  Box,
  Input,
  Select,
  Text,
  Option,
  Tooltip,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  CaseNumbers,
  BlueBox,
  FormContentContainer,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { isCourtHearingArrangemenstStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  CaseType,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'
import {
  JudgeSubsections,
  ReactSelectOption,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import DefenderInfo from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo'
import { rcHearingArrangements as m } from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const HearingArrangements: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [modalVisible, setModalVisible] = useState(false)
  const [, setCourtDateIsValid] = useState(true)

  const router = useRouter()
  const id = router.query.id

  const {
    updateCase,
    autofill,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const { formatMessage } = useIntl()

  const { data: userData, loading: userLoading } = useQuery<UserData>(
    UsersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const judges = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id }
    })

  const registrars = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.REGISTRAR &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id }
    })

  const defaultJudge = judges?.find(
    (judge: Option) => judge.value === workingCase?.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar: Option) => registrar.value === workingCase?.registrar?.id,
  )

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const theCase = workingCase

    if (theCase.requestedCourtDate) {
      autofill('courtDate', theCase.requestedCourtDate, theCase)
    }

    setWorkingCase(theCase)
  }, [setWorkingCase, workingCase, autofill])

  const setJudge = (id: string) => {
    if (workingCase) {
      setAndSendToServer('judgeId', id, workingCase, setWorkingCase, updateCase)

      const judge = userData?.users.find((j) => j.id === id)

      setWorkingCase({ ...workingCase, judge: judge })
    }
  }

  const setRegistrar = (id: string) => {
    if (workingCase) {
      setAndSendToServer(
        'registrarId',
        id,
        workingCase,
        setWorkingCase,
        updateCase,
      )

      const registrar = userData?.users.find((r) => r.id === id)

      setWorkingCase({ ...workingCase, registrar: registrar })
    }
  }

  const handleNextButtonClick = () => {
    if (
      workingCase?.notifications?.find(
        (notification) => notification.type === NotificationType.COURT_DATE,
      )
    ) {
      router.push(`${Constants.COURT_RECORD_ROUTE}/${workingCase.id}`)
    } else {
      setModalVisible(true)
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase || userLoading}
      notFound={caseNotFound}
    >
      <FormContentContainer>
        {workingCase.comments && (
          <Box marginBottom={5}>
            <AlertMessage
              type="warning"
              title={formatMessage(m.comments.title)}
              message={workingCase.comments}
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.setJudge.title)} `}
              <Tooltip text={formatMessage(m.sections.setJudge.tooltip)} />
            </Text>
          </Box>
          <Select
            name="judge"
            label="Veldu dómara"
            placeholder="Velja héraðsdómara"
            value={defaultJudge}
            options={judges}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setJudge((selectedOption as ReactSelectOption).value.toString())
            }
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.setRegistrar.title)} `}
              <Tooltip text={formatMessage(m.sections.setRegistrar.tooltip)} />
            </Text>
          </Box>
          <Select
            name="registrar"
            label="Veldu dómritara"
            placeholder="Velja dómritara"
            value={defaultRegistrar}
            options={registrars}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setRegistrar(
                (selectedOption as ReactSelectOption).value.toString(),
              )
            }
            required
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.requestedCourtDate.title)}
            </Text>
          </Box>
          <Box marginBottom={3}>
            <BlueBox>
              <Box marginBottom={2}>
                <DateTime
                  name="courtDate"
                  selectedDate={
                    workingCase.courtDate
                      ? new Date(workingCase.courtDate)
                      : undefined
                  }
                  minDate={new Date()}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    newSetAndSendDateToServer(
                      'courtDate',
                      date,
                      valid,
                      workingCase,
                      setWorkingCase,
                      setCourtDateIsValid,
                      updateCase,
                    )
                  }}
                  blueBox={false}
                  required
                />
              </Box>
              <Input
                data-testid="courtroom"
                name="courtroom"
                label="Dómsalur"
                autoComplete="off"
                value={workingCase.courtRoom || ''}
                placeholder="Skráðu inn dómsal"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'courtRoom',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'courtRoom',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
              />
            </BlueBox>
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <DefenderInfo
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.COURT_SINGLE_REQUEST_BASE_ROUTE}/${workingCase.id}`}
          onNextButtonClick={handleNextButtonClick}
          nextIsDisabled={!isCourtHearingArrangemenstStepValidRC(workingCase)}
        />
      </FormContentContainer>
      {modalVisible && (
        <Modal
          title={formatMessage(
            workingCase.type === CaseType.CUSTODY
              ? m.modal.custodyCases.heading
              : m.modal.travelBanCases.heading,
          )}
          text={formatMessage(
            workingCase.type === CaseType.CUSTODY
              ? m.modal.custodyCases.text
              : m.modal.travelBanCases.text,
          )}
          isPrimaryButtonLoading={isSendingNotification}
          handleSecondaryButtonClick={() => {
            router.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
          }}
          handlePrimaryButtonClick={async () => {
            const notificationSent = await sendNotification(
              workingCase.id,
              NotificationType.COURT_DATE,
            )

            if (notificationSent) {
              router.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
            }
          }}
          primaryButtonText={formatMessage(m.modal.shared.primaryButtonText)}
          secondaryButtonText={formatMessage(
            m.modal.shared.secondaryButtonText,
          )}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
