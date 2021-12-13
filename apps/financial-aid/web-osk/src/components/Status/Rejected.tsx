import React, { useContext } from 'react'
import { Button, Text, Box } from '@island.is/island-ui/core'

import { getState, ApplicationState } from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

interface Props {
  state: ApplicationState
  rejectionComment?: string
  isStateVisible: boolean
  isApplicant?: boolean
}

const Rejected = ({
  state,
  rejectionComment,
  isStateVisible,
  isApplicant = true,
}: Props) => {
  if (!isStateVisible) {
    return null
  }

  const { municipality } = useContext(AppContext)

  return (
    <>
      <Text as="h2" variant="h3" color="red400" marginBottom={[4, 4, 5]}>
        Umsókn þinni um fjárhagsaðstoð hefur verið{' '}
        {getState[state].toLowerCase()}
      </Text>

      {isApplicant && (
        <>
          {rejectionComment && (
            <Text variant="intro" marginBottom={[2, 2, 3]}>
              {rejectionComment}
            </Text>
          )}

          <Box marginBottom={[3, 3, 5]}>
            <Button
              variant="text"
              icon="open"
              iconType="outline"
              onClick={() => {
                window.open('', '_ blank')
              }}
            >
              Reglur um fjárhagsaðstoð
            </Button>
          </Box>

          <Text as="h3" variant="h3" marginBottom={2}>
            Málskot
          </Text>

          <Text>
            Bent skal á að unnt er að skjóta ákvörðun þessari til
            áfrýjunarnefndar þíns sveitarfélags. Skal það gert skriflega og
            innan fjögurra vikna. Fyrir frekari upplýsingar um málskot hafðu
            samband með tölvupósti á netfangið{' '}
            <a href={`mailto:${municipality?.email}`} rel="noreferrer noopener">
              {municipality?.email}
            </a>
            .  Ákvörðun ráðsins má síðan skjóta til úrskurðarnefndar
            velferðarmála, Katrínartúni 2, 105 Reykjavík innan þriggja mánaða.
          </Text>
        </>
      )}
    </>
  )
}

export default Rejected
