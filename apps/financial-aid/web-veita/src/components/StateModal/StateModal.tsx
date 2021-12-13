import React, { useState } from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import { AnimateSharedLayout } from 'framer-motion'

import * as styles from './StateModal.css'

import {
  OptionsModal,
  RejectModal,
  AcceptModal,
  DataNeededModal,
} from '@island.is/financial-aid-web/veita/src/components'

import {
  Application,
  ApplicationState,
  CreateAmount,
  eventTypeFromApplicationState,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { useApplicationState } from '../../utils/useApplicationState'
import StateModalContainer from './StateModalContainer'

interface Props {
  isVisible: boolean
  onVisibilityChange: React.Dispatch<React.SetStateAction<boolean>>
  applicationId: string
  currentState: ApplicationState
  setApplication: React.Dispatch<React.SetStateAction<Application | undefined>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  homeCircumstances: HomeCircumstances
  spouseNationalId?: string
}

const StateModal = ({
  isVisible,
  onVisibilityChange,
  applicationId,
  currentState,
  setApplication,
  setIsLoading,
  homeCircumstances,
  spouseNationalId,
}: Props) => {
  const [selected, setSelected] = useState<ApplicationState | undefined>()

  const changeApplicationState = useApplicationState()

  const saveStateApplication = async (
    applicationId: string,
    state: ApplicationState,
    rejection?: string,
    comment?: string,
    amount?: CreateAmount,
  ) => {
    setIsLoading(true)

    onVisibilityChange((isVisible) => !isVisible)

    await changeApplicationState(
      applicationId,
      state,
      eventTypeFromApplicationState[state],
      rejection,
      comment,
      amount,
    )
      .then((updatedApplication) => {
        setIsLoading(false)
        setApplication(updatedApplication)
      })
      .catch(() => {
        //TODO ERROR STATE
        setIsLoading(false)
      })
  }

  const closeModal = (): void => {
    onVisibilityChange(false)
  }

  const onClickCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setSelected(undefined)
  }

  const stateNeedInput = [
    {
      state: ApplicationState.REJECTED,
      modalHeader: 'Synja umsókn',
    },
    {
      state: ApplicationState.APPROVED,
      modalHeader: 'Samþykkja umsókn',
    },
    {
      state: ApplicationState.DATANEEDED,
      modalHeader: 'Vantar gögn',
    },
  ]

  const headingText = (state?: ApplicationState): string => {
    const header =
      stateNeedInput.find((item) => state === item.state)?.modalHeader ??
      'Stöðubreyting'

    return header
  }

  const saveOrNextWindow = (stateOption: ApplicationState) => {
    const goToNextWindow = stateNeedInput.find(
      (item) => stateOption === item.state,
    )
    if (goToNextWindow) {
      setSelected(stateOption)
      return
    }

    saveStateApplication(applicationId, stateOption)
  }

  return (
    <StateModalContainer
      isVisible={isVisible}
      onVisibilityChange={onVisibilityChange}
      closeModal={closeModal}
    >
      <Box
        paddingLeft={4}
        paddingY={2}
        background="blue400"
        className={styles.modalHeadline}
      >
        <Text fontWeight="semiBold" color="white">
          {headingText(selected)}
        </Text>
      </Box>

      <Box padding={4}>
        <AnimateSharedLayout type="crossfade">
          <OptionsModal
            isModalVisable={selected === undefined}
            activeState={currentState}
            onClick={(e, stateOption) => {
              e.stopPropagation()

              saveOrNextWindow(stateOption)
            }}
          />

          <DataNeededModal
            isModalVisable={selected === ApplicationState.DATANEEDED}
            onCancel={onClickCancel}
            onSaveApplication={(comment?: string) => {
              if (!selected) {
                return
              }
              saveStateApplication(applicationId, selected, undefined, comment)
            }}
          />

          <AcceptModal
            isModalVisable={selected === ApplicationState.APPROVED}
            onCancel={onClickCancel}
            onSaveApplication={(amount: CreateAmount) => {
              if (!selected) {
                return
              }
              saveStateApplication(
                applicationId,
                selected,
                undefined,
                undefined,
                amount,
              )
            }}
            homeCircumstances={homeCircumstances}
            spouseNationalId={spouseNationalId}
          />

          <RejectModal
            isModalVisable={selected === ApplicationState.REJECTED}
            onCancel={onClickCancel}
            onSaveApplication={(reasonForRejection?: string) => {
              if (!selected) {
                return
              }
              saveStateApplication(applicationId, selected, reasonForRejection)
            }}
          />
        </AnimateSharedLayout>
      </Box>
    </StateModalContainer>
  )
}

export default StateModal
