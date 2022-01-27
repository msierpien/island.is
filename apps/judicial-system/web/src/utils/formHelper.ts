import type { Case, UpdateCase } from '@island.is/judicial-system/types'
import formatISO from 'date-fns/formatISO'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import {
  padTimeWithZero,
  parseArray,
  parseBoolean,
  parseNull,
  parseString,
  parseTime,
  replaceTabs,
} from './formatters'
import { validate, Validation } from './validate'

export const removeTabsValidateAndSet = (
  field: string,
  evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  let value: string

  if (evt.target.value.includes('\t')) {
    value = replaceTabs(evt.target.value)
    evt.target.value = value
  } else {
    value = evt.target.value
  }

  validateAndSet(
    field,
    value,
    validations,
    theCase,
    setCase,
    errorMessage,
    setErrorMessage,
  )
}

export const removeErrorMessageIfValid = (
  validations: Validation[],
  value: string,
  errorMessage?: string,
  errorMessageSetter?: (value: React.SetStateAction<string>) => void,
) => {
  const isValid = !validations.some(
    (validation) => validate(value, validation).isValid === false,
  )

  if (errorMessage !== '' && errorMessageSetter && isValid) {
    errorMessageSetter('')
  }
}

export const validateAndSetErrorMessage = (
  validations: Validation[],
  value: string,
  errorMessageSetter?: (value: React.SetStateAction<string>) => void,
) => {
  const error = validations
    .map((v) => validate(value, v))
    .find((v) => v.isValid === false)

  if (error && errorMessageSetter) {
    errorMessageSetter(error.errorMessage)
    return
  }
}

export const validateAndSet = (
  field: string,
  value: string,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  removeErrorMessageIfValid(validations, value, errorMessage, setErrorMessage)

  setCase({
    ...theCase,
    [field]: value,
  })
}

export const validateAndSetTime = (
  field: string,
  currentValue: string | undefined,
  time: string,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
  setTime?: (value: React.SetStateAction<string | undefined>) => void,
) => {
  if (currentValue) {
    // remove optional
    if (setTime) {
      setTime(time)
    }

    const paddedTime = padTimeWithZero(time)

    const isValid = !validations.some(
      (validation) => validate(paddedTime, validation).isValid === false,
    )

    const arrestDateMinutes = parseTime(currentValue, paddedTime)

    if (errorMessage !== '' && setErrorMessage && isValid) {
      setErrorMessage('')
    }

    setCase({
      ...theCase,
      [field]: arrestDateMinutes,
    })
  }
}

export const setAndSendDateToServer = (
  field: string,
  date: Date | undefined,
  isValid: boolean,
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  if (!isValid) {
    return
  }

  let formattedDate = null

  if (date !== undefined) {
    formattedDate = formatISO(date, {
      representation: 'complete',
    })
  }

  setCase({
    ...theCase,
    [field]: formattedDate,
  })

  if (theCase.id !== '') {
    updateCase(theCase.id, {
      [field]: formattedDate,
    })
  }
}

export const validateAndSendToServer = (
  field: string,
  value: string,
  validations: Validation[],
  theCase: Case,
  updateCase: (id: string, updateCase: UpdateCase) => void,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  validateAndSetErrorMessage(validations, value, setErrorMessage)

  if (theCase.id !== '') {
    updateCase(theCase.id, parseString(field, value))
  }
}

export const validateAndSendTimeToServer = (
  field: string,
  currentValue: string | undefined,
  time: string,
  validations: Validation[],
  theCase: Case,
  updateCase: (id: string, updateCase: UpdateCase) => void,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  if (currentValue) {
    const paddedTime = padTimeWithZero(time)

    const error = validations
      .map((v) => validate(paddedTime, v))
      .find((v) => v.isValid === false)

    if (error && setErrorMessage) {
      setErrorMessage(error.errorMessage)
      return
    }

    const dateMinutes = parseTime(currentValue, paddedTime)

    if (theCase.id !== '') {
      updateCase(theCase.id, parseString(field, dateMinutes))
    }
  }
}

export const setAndSendToServer = (
  field: string,
  value: string | boolean | undefined,
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  let stringValue = ''

  setCase({
    ...theCase,
    [field]: value,
  })
  if (theCase.id !== '') {
    if (typeof value === 'string') {
      stringValue = value
      return updateCase(theCase.id, parseString(field, stringValue))
    } else if (typeof value === 'boolean') {
      return updateCase(theCase.id, parseBoolean(field, value))
    } else {
      return updateCase(theCase.id, parseNull(field))
    }
  }
}

export const setCheckboxAndSendToServer = (
  field: string,
  value: string,
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  const checks = theCase[field as keyof Case]
    ? [...(theCase[field as keyof Case] as [])]
    : ([] as string[])

  if (!checks.includes(value)) {
    checks.push(value)
  } else {
    checks.splice(checks.indexOf(value), 1)
  }

  setCase({
    ...theCase,
    [field]: checks,
  })

  if (theCase.id !== '') {
    updateCase(theCase.id, parseArray(field, checks))
  }
}

export const getTimeFromDate = (date: string | undefined) => {
  return date?.includes('T') ? formatDate(date, TIME_FORMAT) : undefined
}
