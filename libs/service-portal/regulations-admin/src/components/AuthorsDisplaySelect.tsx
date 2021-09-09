import React, { useMemo, useState } from 'react'
import { Option, Select, Button } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'
import { editorMsgs as msg } from '../messages'
import { Kennitala } from '@island.is/regulations'
import { AuthorState } from '../state/types'
import { emptyOption, findValueOption } from '../utils'
import { mockAuthorsAvailable } from '../_mockData'

type AuthorsDisplaySelectProps = {
  authors?: Array<AuthorState>
  getValues: (id: Kennitala, name: string) => void
  removeItem: (id: string) => void
}

export const AuthorsDisplaySelect = (props: AuthorsDisplaySelectProps) => {
  const t = useIntl().formatMessage
  const { authors, getValues, removeItem } = props

  const [activeSel, setActiveSel] = useState<Kennitala>()

  const authorSelectOptions = useMemo(() => {
    const storedAuthorIds = authors?.map((item) => item.authorId)
    const authorSelection = mockAuthorsAvailable.filter(
      (item) => !storedAuthorIds?.includes(item.id as Kennitala),
    )
    return [emptyOption(t(msg.author_add))].concat(
      authorSelection?.map(
        (m: any): Option => ({
          value: m.id,
          label: m.name,
        }),
      ) ?? [],
    ) as ReadonlyArray<Option>
  }, [authors])
  console.log('authors', authors)
  return (
    <>
      {authors &&
        authors.length > 0 &&
        `${
          authors.length > 1
            ? t(msg.author_legened__plural)
            : t(msg.author_legened)
        }: `}
      <ul>
        {authors?.map((person) => {
          return (
            <li key={person.authorId}>
              {person.name || person.authorId}{' '}
              {person.local && (
                <Button
                  icon={'remove'}
                  variant={'text'}
                  onClick={() => removeItem(person.authorId)}
                >
                  {t(msg.author_remove)}
                </Button>
              )}
            </li>
          )
        })}
      </ul>
      <div>
        <Select
          name="addAuthor"
          isSearchable
          label={t(msg.author_legened)}
          placeholder={t(msg.author_legened)}
          value={findValueOption(authorSelectOptions, activeSel)}
          options={authorSelectOptions}
          onChange={(option) =>
            setActiveSel((option as Option).value as Kennitala)
          }
          size="sm"
        />
        {activeSel && (
          <Button
            icon={'add'}
            onClick={(e) => {
              getValues(
                activeSel as Kennitala,
                mockAuthorsAvailable.find((c) => c.id === activeSel)?.name ??
                  '',
              )
              setActiveSel(undefined)
            }}
          >
            {t(msg.author_add)}
          </Button>
        )}
      </div>
    </>
  )
}
