import React, { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import type { Case, UpdateDefendant } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import { StepOneForm } from './StepOneForm'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'

export const StepOne: React.FC = () => {
  const router = useRouter()

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { createCase, isCreatingCase } = useCase()
  const { updateDefendant } = useDefendants()
  const { loading: institutionLoading } = useInstitution()

  const handleNextButtonClick = async (theCase: Case) => {
    if (!theCase.id) {
      const createdCase = await createCase(theCase)

      if (
        createdCase &&
        createdCase.defendants &&
        createdCase.defendants.length > 0 &&
        theCase.defendants &&
        theCase.defendants.length > 0
      ) {
        await updateDefendant(createdCase.id, createdCase.defendants[0].id, {
          gender: theCase.defendants[0].gender,
          name: theCase.defendants[0].name,
          address: theCase.defendants[0].address,
          nationalId: theCase.defendants[0].nationalId,
        })
      }

      router.push(`${Constants.STEP_TWO_ROUTE}/${createdCase.id}`)
    } else {
      router.push(`${Constants.STEP_TWO_ROUTE}/${theCase.id}`)
    }
  }

  const updateDefendantState = (
    defendantId: string,
    update: UpdateDefendant,
  ) => {
    if (workingCase.defendants) {
      const indexOfDefendantToUpdate = workingCase.defendants.findIndex(
        (defendant) => defendant.id === defendantId,
      )

      const newDefendants = [...workingCase.defendants]

      newDefendants[indexOfDefendantToUpdate] = {
        ...newDefendants[indexOfDefendantToUpdate],
        ...update,
      }

      setWorkingCase({ ...workingCase, defendants: newDefendants })
    }
  }

  useEffect(() => {
    document.title = 'Sakborningur - Réttarvörslugátt'
  }, [])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_ONE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
    >
      {!institutionLoading && (
        <StepOneForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          loading={isCreatingCase}
          handleNextButtonClick={handleNextButtonClick}
          updateDefendantState={updateDefendantState}
        />
      )}
    </PageLayout>
  )
}

export default StepOne
