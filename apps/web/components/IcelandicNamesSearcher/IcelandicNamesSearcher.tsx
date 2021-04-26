import React, {
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import cn from 'classnames'
import {
  Box,
  Button,
  Checkbox,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  SidebarAccordion,
  Stack,
  Text,
  Table,
  ButtonProps,
  Icon,
  Input,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { alphabet } from './data'

import { useLazyQuery } from '@apollo/client'
import {
  GetIcelandicNameBySearchQuery,
  GetIcelandicNameBySearchQueryVariables,
  GetIcelandicNameByInitialLetterQuery,
  GetIcelandicNameByInitialLetterQueryVariables,
  IcelandicName,
} from '@island.is/web/graphql/schema'
import {
  GET_ICELANDIC_NAME_BY_SEARCH,
  GET_ICELANDIC_NAME_BY_INITIAL_LETTER,
} from '@island.is/web/screens/queries/IcelandicNamesRegistry'

import * as styles from './IcelandicNamesSearcher.treat'

const {
  Table: T,
  Head: THead,
  Body: TBody,
  Data: TData,
  Row: TRow,
  HeadData: THeadData,
} = Table

type ToggledFiltersState = {
  males: boolean
  females: boolean
  middleNames: boolean
  approved: boolean
  denied: boolean
  pending: boolean
}

const initialToggledFiltersState: ToggledFiltersState = {
  males: false,
  females: false,
  middleNames: false,
  approved: false,
  denied: false,
  pending: false,
}

type Action =
  | { type: 'toggleMales' }
  | { type: 'toggleFemales' }
  | { type: 'toggleMiddleNames' }
  | { type: 'toggleDenied' }
  | { type: 'toggleApproved' }
  | { type: 'clearCategories' }
  | { type: 'clearStatuses' }
  | { type: 'clearAll' }

const toggledFiltersReducer = (
  state: ToggledFiltersState,
  action: Action,
): ToggledFiltersState => {
  switch (action.type) {
    case 'toggleMales':
      return { ...state, males: !state.males }
    case 'toggleFemales':
      return { ...state, females: !state.females }
    case 'toggleMiddleNames':
      return { ...state, middleNames: !state.middleNames }
    case 'toggleDenied':
      return { ...state, denied: !state.denied }
    case 'toggleApproved':
      return { ...state, approved: !state.approved }
    case 'clearCategories':
      return { ...state, males: false, females: false, middleNames: false }
    case 'clearStatuses':
      return { ...state, approved: false, denied: false }
    case 'clearAll':
      return initialToggledFiltersState
    default:
      throw new Error()
  }
}

type NameType = Pick<
  IcelandicName,
  | 'id'
  | 'icelandicName'
  | 'type'
  | 'status'
  | 'verdict'
  | 'visible'
  | 'description'
  | 'url'
>

const paddingTop = [3, 3, 3, 3, 0] as ResponsiveSpace

export const IcelandicNamesSearcher: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedLetter, setSelectedLetter] = useState<string>('')
  const [hasSearched, setHasSearched] = useState<boolean>(false)
  const [tableData, setTableData] = useState<NameType[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [search, { data: searchData, loading: searchLoading }] = useLazyQuery<
    GetIcelandicNameBySearchQuery,
    GetIcelandicNameBySearchQueryVariables
  >(GET_ICELANDIC_NAME_BY_SEARCH, {
    fetchPolicy: 'no-cache',
  })

  const [
    searchByInitialLetter,
    { data: searchByInitialLetterData, loading: searchByInitialLetterloading },
  ] = useLazyQuery<
    GetIcelandicNameByInitialLetterQuery,
    GetIcelandicNameByInitialLetterQueryVariables
  >(GET_ICELANDIC_NAME_BY_INITIAL_LETTER, {
    fetchPolicy: 'no-cache',
  })

  const isBusy = searchLoading || searchByInitialLetterloading

  const [filteredNamesList, setFilteredNamesList] = useState<NameType[]>(
    tableData,
  )
  const [filters, dispatch] = useReducer(
    toggledFiltersReducer,
    initialToggledFiltersState,
  )

  const filterFns = {
    denied: (x: NameType) => x.status === 'Haf',
    approved: (x: NameType) => x.status === 'Sam',
    pending: (x: NameType) => x.status === 'Óaf',
    females: (x: NameType) => ['ST', 'RST'].includes(x.type),
    males: (x: NameType) => ['DR', 'RDR'].includes(x.type),
    middleNames: (x: NameType) => x.type === 'MI',
  }

  useMemo(() => {
    if (searchData?.getIcelandicNameBySearch) {
      setTableData(searchData.getIcelandicNameBySearch)
    }
  }, [searchData])

  useMemo(() => {
    if (searchByInitialLetterData?.getIcelandicNameByInitialLetter) {
      setTableData(searchByInitialLetterData.getIcelandicNameByInitialLetter)
    }
  }, [searchByInitialLetterData])

  useLayoutEffect(() => {
    const filtersSelected = Object.keys(filters).filter((key) => filters[key])

    const data = tableData.filter((x) => x.visible)

    if (filtersSelected.length) {
      const filtered = data.filter((x) => {
        return filtersSelected
          .map((f) => {
            const fn = filterFns[f]
            if (!fn) return true
            return fn(x)
          })
          .some((x) => x)
      })
      setFilteredNamesList(filtered)
    } else {
      setFilteredNamesList(data)
    }
  }, [tableData, filters])

  const doSearch = useCallback(() => {
    setHasSearched(true)
    setSelectedLetter('')
    search({ variables: { input: { q: searchQuery } } })
    inputRef?.current?.focus()
  }, [search, inputRef, searchQuery])

  const doSearchByInitialLetter = useCallback((letter: string) => {
    setHasSearched(true)
    setSearchQuery('')
    searchByInitialLetter({
      variables: { input: { initialLetter: letter } },
    })
    inputRef?.current?.focus()
  }, [])

  const statusFilterSelected =
    filters.approved || filters.denied || filters.pending
  const typeFilterSelected =
    filters.females || filters.males || filters.middleNames
  const someFilterSelected = Object.keys(filters).filter((key) => filters[key])
    .length

  return (
    <Box marginBottom={[3, 3, 3, 10, 20]} className={styles.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12', '3/5']}>
            <Box marginY={3}>
              <Input
                backgroundColor="blue"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchQuery.length > 1) {
                      doSearch()
                    }
                  }
                }}
                name="q"
                ref={inputRef}
                label={'Nafnaleit'}
                placeholder={'Leita að nafni'}
                size="sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
              />
            </Box>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12', '2/5']}
          >{` `}</GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '12/12', '3/5']}>
            <Box>
              <T>
                <THead>
                  <TRow>
                    <THeadData>Flokkur</THeadData>
                    <THeadData>Nafn</THeadData>
                    <THeadData>Úrskurður</THeadData>
                  </TRow>
                </THead>
                <TBody>
                  {isBusy && (
                    <TRow>
                      <TData colSpan={3}>Augnablik...</TData>
                    </TRow>
                  )}
                  {hasSearched && !isBusy && !filteredNamesList.length && (
                    <TRow>
                      <TData colSpan={3}>
                        {!tableData.length
                          ? 'Ekkert fannst'
                          : 'Ekkert fannst með völdum síum'}
                      </TData>
                    </TRow>
                  )}
                  {!isBusy &&
                    filteredNamesList.map(
                      ({ icelandicName, status, type, verdict }, index) => {
                        return (
                          <TRow key={index}>
                            <TData>
                              <Text>
                                {
                                  NameTypeStrings[
                                    type as keyof typeof NameTypeStrings
                                  ]
                                }
                              </Text>
                            </TData>
                            <TData>
                              <Text as="span" fontWeight="semiBold">
                                {`${icelandicName[0].toUpperCase()}${icelandicName.substring(
                                  1,
                                )}`}
                              </Text>
                            </TData>
                            <TData>
                              {!!verdict && (
                                <Text>
                                  <Button
                                    colorScheme={
                                      status === 'Haf'
                                        ? 'destructive'
                                        : 'default'
                                    }
                                    variant="text"
                                    size="small"
                                    icon="open"
                                    iconType="outline"
                                  >
                                    {verdict}
                                  </Button>
                                </Text>
                              )}
                            </TData>
                          </TRow>
                        )
                      },
                    )}
                </TBody>
              </T>
            </Box>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '12/12', '2/5']}
            paddingTop={paddingTop}
          >
            <Stack space={[1, 1, 2]}>
              <Box>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Box flexGrow={1}>
                    <Text variant="h3">Sía lista</Text>
                  </Box>
                  <Box>
                    <Icon
                      icon="filter"
                      type="filled"
                      color="blue400"
                      size="small"
                    />
                  </Box>
                </Box>
                <Box paddingY={1}>
                  <Divider />
                </Box>
              </Box>
              <Box padding={2} borderRadius="large" border="standard">
                <SidebarAccordion
                  id="icelandic_names_alphabet"
                  label="Upphafsstafur"
                >
                  <div className={styles.alphabetList}>
                    {alphabet.map((letter, index) => {
                      return (
                        <button
                          aria-label={letter}
                          className={cn(styles.alphabetButton, {
                            [styles.alphabetButtonSelected]:
                              selectedLetter === letter,
                          })}
                          key={index}
                          onClick={() => {
                            setSelectedLetter(letter)
                            doSearchByInitialLetter(letter)
                          }}
                        >
                          {letter}
                        </button>
                      )
                    })}
                  </div>
                </SidebarAccordion>
                <Box paddingY={2}>
                  <Divider />
                </Box>
                <SidebarAccordion
                  id="icelandic_names_categories"
                  label="Flokkur"
                >
                  <Stack space={[1, 1, 2]}>
                    <Checkbox
                      label="Drengir"
                      checked={filters.males}
                      onChange={() => dispatch({ type: 'toggleMales' })}
                    />
                    <Checkbox
                      label="Stúlkur"
                      checked={filters.females}
                      onChange={() => dispatch({ type: 'toggleFemales' })}
                    />
                    <Checkbox
                      label="Millinöfn (öll kyn)"
                      checked={filters.middleNames}
                      onChange={() => dispatch({ type: 'toggleMiddleNames' })}
                    />
                    {!!typeFilterSelected && (
                      <ResetButton
                        onClick={() => dispatch({ type: 'clearCategories' })}
                      >
                        Hreinsa val
                      </ResetButton>
                    )}
                  </Stack>
                </SidebarAccordion>
                <Box paddingY={2}>
                  <Divider />
                </Box>
                <SidebarAccordion id="icelandic_names_statuses" label="Staða">
                  <Stack space={[1, 1, 2]}>
                    <Checkbox
                      label="Samþykkt"
                      checked={filters.approved}
                      onChange={() => dispatch({ type: 'toggleApproved' })}
                    />
                    <Checkbox
                      label="Hafnað"
                      checked={filters.denied}
                      onChange={() => dispatch({ type: 'toggleDenied' })}
                    />
                    {!!statusFilterSelected && (
                      <ResetButton
                        onClick={() => dispatch({ type: 'clearStatuses' })}
                      >
                        Hreinsa val
                      </ResetButton>
                    )}
                  </Stack>
                </SidebarAccordion>
              </Box>
              {!!someFilterSelected && (
                <ResetButton onClick={() => dispatch({ type: 'clearAll' })}>
                  Hreinsa síu
                </ResetButton>
              )}
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

const ResetButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Box
      display="inlineFlex"
      alignItems="flexEnd"
      flexDirection="column"
      width="full"
    >
      <Button variant="text" size="small" icon="reload" {...rest}>
        {children}
      </Button>
    </Box>
  )
}

const NameTypeStrings = {
  ST: 'Stúlkur',
  DR: 'Drengir',
  MI: 'Millinafn',
  RST: 'Stúlkur (ritbr.)',
  RDR: 'Drengir (ritbr.)',
}
