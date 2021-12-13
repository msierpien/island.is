import { useContext } from 'react'
import { useMutation } from '@apollo/client'
import {
  Amount,
  Application,
  ApplicationEventType,
  ApplicationFilters,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'
import { ApplicationFiltersContext } from '../components/ApplicationFiltersProvider/ApplicationFiltersProvider'
import { AdminContext } from '../components/AdminProvider/AdminProvider'
import {
  UpdateApplicationMutation,
  ApplicationFiltersMutation,
} from '@island.is/financial-aid-web/veita/graphql/sharedGql'

export const useApplicationState = () => {
  const [updateApplicationMutation, { loading: saveLoading }] = useMutation<{
    updateApplication: Application
  }>(UpdateApplicationMutation)

  const [applicationFiltersQuery, { loading: loadingFilters }] = useMutation<{
    applicationFilters: ApplicationFilters
  }>(ApplicationFiltersMutation)

  const { setApplicationFilters } = useContext(ApplicationFiltersContext)

  const { admin } = useContext(AdminContext)

  const fetchAndSetFilters = async () => {
    const { data } = await applicationFiltersQuery()
    if (data) {
      setApplicationFilters(data.applicationFilters)
    }
  }

  const changeApplicationState = async (
    applicationId: string,
    state: ApplicationState,
    event: ApplicationEventType,
    rejection?: string,
    comment?: string,
    amount?: Amount,
  ) => {
    if (saveLoading === false && loadingFilters === false && applicationId) {
      const { data } = await updateApplicationMutation({
        variables: {
          input: {
            id: applicationId,
            state,
            rejection,
            comment,
            staffId: admin?.staff?.id,
            event,
            amount,
          },
        },
      })

      if (data) {
        await fetchAndSetFilters()
        return data.updateApplication
      }
    }
  }

  return changeApplicationState
}
