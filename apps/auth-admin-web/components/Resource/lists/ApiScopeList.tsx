import React from 'react'
import { ApiScopeDTO } from '../../../entities/dtos/api-scope-dto'
import { useRouter } from 'next/router'
import { useState } from 'react'
import ResourceListDisplay from './ListDisplay'
import { ResourcesService } from '../../../services/ResourcesService'
import { ApiScope } from '../../../entities/models/api-scope.model'
import ConfirmModal from '../../common/ConfirmModal'

const ApiScopeList: React.FC = () => {
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [apiScopes, setApiScopes] = useState<ApiScope[]>([])
  const [lastPage, setLastPage] = useState(1)
  const router = useRouter()
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [scopeToRemove, setScopeToRemove] = React.useState('')

  const edit = (apiScope: ApiScopeDTO) => {
    router.push(`/resource/api-scope/${encodeURIComponent(apiScope.name)}`)
  }

  const getResources = async (page: number, count: number) => {
    const response = await ResourcesService.findAndCountAllApiScopes(
      page,
      count,
    )
    if (response) {
      const resourceArr = response.rows.sort((c1, c2) => {
        if (!c1.archived && !c2.archived) return 0
        if (!c1.archived && c2.archived) return 1
        if (c1.archived && !c2.archived) return -1
        return 0
      })
      setApiScopes(resourceArr.reverse())
      setLastPage(Math.ceil(response.count / count))
    }
  }

  const handlePageChange = async (page: number, countPerPage: number) => {
    getResources(page, countPerPage)
    setPage(page)
    setCount(countPerPage)
  }

  const remove = async () => {
    const response = await ResourcesService.deleteApiScope(scopeToRemove)
    if (response) {
      getResources(page, count)
    }

    closeModal()
  }

  const confirmRemove = async (name: string) => {
    setScopeToRemove(name)
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to archive this Api scope:{' '}
        <span>{scopeToRemove}</span>
      </p>
    )
  }

  return (
    <div>
      <ResourceListDisplay
        list={apiScopes}
        header={'Api scopes'}
        linkHeader={'Create new Api scope'}
        createUri={'/resource/api-scope'}
        lastPage={lastPage}
        handlePageChange={handlePageChange}
        edit={edit}
        remove={confirmRemove}
      ></ResourceListDisplay>
      <ConfirmModal
        modalIsOpen={modalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeModal}
        confirmation={remove}
        confirmationText="Archive"
      ></ConfirmModal>
    </div>
  )
}

export default ApiScopeList
