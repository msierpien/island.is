import React from 'react'
import {
  Box,
  FormStepper as IslandUIFormStepper,
  FormStepperSection,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'

interface ProcessProps {
  title: string
  completedText: string
  sections: FormStepperSection[]
  activeSection: number
  activeCar?: string
}

export const FormStepper = ({
  title,
  completedText,
  sections,
  activeSection,
  activeCar,
}: ProcessProps) => {
  const {
    t: { processes: t },
  } = useI18n()

  return (
    <Box padding={[0, 0, 0, 3, 4]}>
      <Stack space={4}>
        <Box>
          <Text variant="h3">{activeCar || title}</Text>
          <Text color="purple600">
            {activeSection < sections.length
              ? `${t.step} ${activeSection + 1} ${t.outOf} ${sections.length}`
              : completedText}
          </Text>
        </Box>
        <IslandUIFormStepper
          sections={sections}
          activeSection={activeSection}
        />
      </Stack>
    </Box>
  )
}
export default FormStepper
