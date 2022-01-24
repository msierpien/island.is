import React, { createContext, FC, ReactNode } from 'react'
import { Dialog, DialogDisclosure, useDialogState } from 'reakit/Dialog'
import { usePopoverState, Popover, PopoverDisclosure } from 'reakit/Popover'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Inline } from '../Inline/Inline'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import * as styles from './Filter.css'

export interface FilterProps {
  /** Label for the clear all button. Should be used for localization. */
  labelClearAll: string

  /** Label for the clear button. Should be used for localization. */
  labelClear: string

  /** Lable for open filter button when in mobile version. */
  labelOpen: string

  /** Label for close icon to add title to button for screen readers in mobile version. */
  labelClose?: string

  /** Label for filter title when expanded in mobile version. */
  labelTitle?: string

  /** Label for show result button in expanded mobile version. */
  labelResult?: string

  /** Number of search results to display on the show result button in mobile version*/
  resultCount?: number

  /** Filter input component */
  filterInput?: ReactNode

  /** How the filter should be displayed */
  variant?: 'popover' | 'dialog' | 'default'

  /** Align popover button (and input if also applied) to the left or right */
  align?: 'left' | 'right'

  /** Event handler for clear filter event. */
  onFilterClear: () => void

  /** Swap input and filter button locations */
  reverse?: boolean
}

/**
 * Datatype to use for Filter context.
 * Provides the Filter's childs access to shared values,
 * like the `isDialog` state with out bloating the childs props.
 */
interface FilterContextValue {
  variant?: FilterProps['variant']
}

export const FilterContext = createContext<FilterContextValue>({
  variant: undefined,
})

export const Filter: FC<FilterProps> = ({
  labelClearAll = '',
  labelClear = '',
  labelOpen = '',
  labelClose = '',
  labelTitle = '',
  labelResult = '',
  resultCount = 0,
  align,
  variant = 'default',
  filterInput,
  onFilterClear,
  reverse,
  children,
}) => {
  const dialog = useDialogState()
  const popover = usePopoverState({
    placement: 'bottom-start',
    unstable_flip: true,
    gutter: 8,
  })

  const hasFilterInput = !!filterInput

  return (
    <FilterContext.Provider value={{ variant }}>
      {variant === 'popover' && (
        <>
          <Box
            display="flex"
            width="full"
            justifyContent={align === 'right' ? 'flexEnd' : 'flexStart'}
          >
            <Inline space={2} reverse={reverse}>
              <Box
                component={PopoverDisclosure}
                background="white"
                display="inlineBlock"
                borderRadius="large"
                tabIndex={-1}
                {...popover}
              >
                <Button as="span" variant="utility" icon="filter" fluid>
                  {labelOpen}
                </Button>
              </Box>

              {hasFilterInput && filterInput}
            </Inline>
          </Box>

          <Box
            component={Popover}
            background="white"
            borderRadius="large"
            boxShadow="subtle"
            className={styles.popoverContainer}
            {...popover}
          >
            <Stack space={4} dividers={false}>
              {children}
            </Stack>

            <Box
              display="flex"
              width="full"
              paddingX={3}
              paddingY={2}
              justifyContent="center"
              background="blue100"
            >
              <Button
                icon="reload"
                size="small"
                variant="text"
                onClick={onFilterClear}
              >
                {labelClearAll}
              </Button>
            </Box>
          </Box>
        </>
      )}
      {variant === 'dialog' && (
        <>
          <DialogDisclosure {...dialog} className={styles.dialogDisclosure}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              background="white"
              padding={2}
              borderRadius="large"
            >
              <Text variant="h5" as="h5">
                {labelOpen}
              </Text>
              <Button
                circle
                size="small"
                colorScheme="light"
                icon="menu"
                iconType="outline"
                title={labelOpen}
              ></Button>
            </Box>
          </DialogDisclosure>
          <Dialog {...dialog}>
            <Box
              background="white"
              position="fixed"
              top={0}
              bottom={0}
              left={0}
              right={0}
              paddingX={3}
              paddingY={3}
              height="full"
              display="flex"
              justifyContent="spaceBetween"
              flexDirection="column"
              className={styles.dialogContainer}
            >
              <Box>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  marginBottom={2}
                >
                  <Text variant="h4" color="blue600">
                    {labelTitle}
                  </Text>
                  <Button
                    circle
                    colorScheme="light"
                    icon="close"
                    iconType="outline"
                    onClick={dialog.hide}
                    title={labelClose}
                  ></Button>
                </Box>

                <Stack space={4} dividers={false}>
                  {hasFilterInput && filterInput}
                  {children}
                </Stack>
              </Box>

              <Box
                background="blue100"
                marginTop={2}
                paddingTop={4}
                paddingBottom={3}
              >
                <Stack space={2} dividers={false} align="center">
                  <Button size="small" onClick={dialog.hide}>
                    {labelResult} ({resultCount})
                  </Button>
                  <Button
                    icon="reload"
                    size="small"
                    variant="text"
                    onClick={onFilterClear}
                  >
                    {labelClear}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>
        </>
      )}
      {variant === 'default' && (
        <>
          <Stack space={3} dividers={false}>
            {hasFilterInput && filterInput}
            {children}
          </Stack>

          <Box textAlign="right" paddingTop={2}>
            <Button
              icon="reload"
              size="small"
              variant="text"
              onClick={onFilterClear}
            >
              {labelClearAll}
            </Button>
          </Box>
        </>
      )}
    </FilterContext.Provider>
  )
}
