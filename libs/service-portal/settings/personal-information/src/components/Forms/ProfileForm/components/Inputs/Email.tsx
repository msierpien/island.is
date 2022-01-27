import React, { FC, useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { m } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  Button,
  Columns,
  Column,
  Input,
  Icon,
  Text,
  LoadingDots,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  useVerifyEmail,
  useUpdateOrCreateUserProfile,
} from '@island.is/service-portal/graphql'

interface Props {
  buttonText: string
  email: string
  emailDirty: (isDirty: boolean) => void
}

interface FormErrors {
  email: string | undefined
  code: string | undefined
}

export const InputEmail: FC<Props> = ({ buttonText, email, emailDirty }) => {
  useNamespaces('sp.settings')
  const { handleSubmit, control, errors, getValues } = useForm()
  const {
    updateOrCreateUserProfile,
    loading: saveLoading,
  } = useUpdateOrCreateUserProfile()
  const { formatMessage } = useLocale()
  const {
    confirmEmailVerification,
    createEmailVerification,
    loading: codeLoading,
    createLoading,
  } = useVerifyEmail()
  const [emailInternal, setEmailInternal] = useState(email)
  const [emailToVerify, setEmailToVerify] = useState(email)

  const [codeInternal, setCodeInternal] = useState('')

  const [emailVerifyCreated, setEmailVerifyCreated] = useState(false)
  const [verificationValid, setVerificationValid] = useState(false)
  const [verifiCationLoading, setVerifiCationLoading] = useState(false)

  const [formErrors, setErrors] = useState<FormErrors>({
    email: undefined,
    code: undefined,
  })

  useEffect(() => {
    if (email && email.length > 0) {
      setEmailInternal(email)
    }
  }, [email])

  useEffect(() => {
    if (email === emailInternal || emailInternal === emailToVerify) {
      emailDirty(false)
    } else {
      emailDirty(true)
    }
  }, [emailInternal])

  const handleSendEmailVerification = async (data: { email: string }) => {
    const emailError = formatMessage({
      id: 'sp.settings:email-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const emailValue = data.email ?? ''

      const response = await createEmailVerification({
        email: emailValue,
      })

      if (response.data?.createEmailVerification?.created) {
        setEmailVerifyCreated(true)
        setEmailToVerify(emailValue)
        setVerificationValid(false)
        setErrors({ ...formErrors, email: undefined })
      } else {
        setErrors({ ...formErrors, email: emailError })
      }
    } catch (err) {
      setErrors({ ...formErrors, email: emailError })
    }
  }

  const handleConfirmCode = async (data: { code: string }) => {
    const codeError = formatMessage({
      id: 'sp.settings:code-service-error',
      defaultMessage:
        'Vandamál með tölvupóstþjónustu. Vinsamlegast reynið aftur síðar.',
    })

    try {
      const codeValue = data.code ?? ''

      setVerifiCationLoading(true)
      const response = await confirmEmailVerification({
        hash: codeValue,
      })

      if (response.data?.confirmEmailVerification?.confirmed) {
        const formValues = getValues()
        const emailValue = formValues?.email
        if (emailValue === emailToVerify) {
          await updateOrCreateUserProfile({
            email: emailToVerify,
          }).then(() => {
            setVerifiCationLoading(false)
            setVerificationValid(true)
          })
        }
        setErrors({ ...formErrors, code: undefined })
      } else {
        setVerifiCationLoading(false)
        setErrors({ ...formErrors, code: codeError })
      }
    } catch (err) {
      setVerifiCationLoading(false)
      setErrors({ ...formErrors, code: codeError })
    }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(handleSendEmailVerification)}>
        <Columns alignY="center">
          <Column width="9/12">
            <InputController
              control={control}
              id="email"
              name="email"
              required={false}
              type="email"
              disabled={verificationValid}
              rules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: formatMessage({
                    id: 'sp.settings:email-wrong-format-message',
                    defaultMessage: 'Netfangið er ekki á réttu formi',
                  }),
                },
              }}
              label={formatMessage(m.email)}
              onChange={(inp) => setEmailInternal(inp.target.value)}
              placeholder={formatMessage(m.email)}
              error={errors.email?.message || formErrors.email}
              size="xs"
              defaultValue={email}
            />
          </Column>
          <Column width="3/12">
            <Box
              display="flex"
              alignItems="flexEnd"
              flexDirection="column"
              paddingTop={2}
            >
              {!createLoading && (
                <button
                  type="submit"
                  disabled={!emailInternal || verificationValid}
                >
                  <Button
                    variant="text"
                    size="small"
                    disabled={!emailInternal || verificationValid}
                  >
                    {emailVerifyCreated
                      ? formatMessage({
                          id: 'sp.settings:resend',
                          defaultMessage: 'Endursenda',
                        })
                      : buttonText}
                  </Button>
                </button>
              )}
              {createLoading && <LoadingDots />}
            </Box>
          </Column>
        </Columns>
        {verificationValid && (
          <Columns alignY="center">
            <Column>
              <Box paddingTop={1}>
                <Button
                  onClick={() => {
                    setEmailVerifyCreated(false)
                    setVerificationValid(false)
                  }}
                  variant="text"
                  size="small"
                >
                  Breyta
                </Button>
              </Box>
            </Column>
          </Columns>
        )}
      </form>
      {emailVerifyCreated && (
        <Box marginTop={3}>
          <Text variant="medium" marginBottom={2}>
            {formatMessage({
              id: 'sp.settings:email-verify-code-sent',
              defaultMessage: `Öryggiskóði hefur verið sendur á netfangið þitt. Sláðu hann inn
                  hér að neðan.`,
            })}
          </Text>

          <form onSubmit={handleSubmit(handleConfirmCode)}>
            <Columns alignY="center">
              <Column width="5/12">
                <Controller
                  control={control}
                  name="code"
                  defaultValue=""
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage(m.verificationCodeRequired),
                    },
                  }}
                  render={({ onChange, value, name }) => (
                    <Input
                      label={formatMessage(m.verificationCode)}
                      placeholder={formatMessage(m.verificationCode)}
                      name={name}
                      value={value}
                      hasError={errors.code || !!formErrors.code}
                      errorMessage={errors.code?.message || formErrors.code}
                      disabled={verificationValid}
                      size="xs"
                      onChange={(inp) => {
                        onChange(inp.target.value)
                        setCodeInternal(inp.target.value)
                      }}
                    />
                  )}
                />
              </Column>
              <Column width="content">
                <Box
                  marginLeft={3}
                  display="flex"
                  alignItems="flexEnd"
                  flexDirection="column"
                  paddingTop={2}
                >
                  {!verifiCationLoading &&
                    (verificationValid ? (
                      <Icon
                        icon="checkmarkCircle"
                        color="mint600"
                        type="filled"
                      />
                    ) : (
                      <button type="submit" disabled={!codeInternal}>
                        <Button
                          variant="text"
                          size="small"
                          disabled={!codeInternal}
                        >
                          {formatMessage(m.confirmCode)}
                        </Button>
                      </button>
                    ))}
                  {verifiCationLoading && <LoadingDots />}
                </Box>
              </Column>
            </Columns>
          </form>
        </Box>
      )}
    </Box>
  )
}
