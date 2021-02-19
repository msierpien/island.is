import React, { FC } from 'react'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { useForm } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { DocumentProviderInput } from './DocumentProviderInput'
import { Contact } from '@island.is/api/schema'
import { useUpdateAdministrativeContact } from '../../shared/useUpdateAdministrativeContact'
import { ContactInput } from '../../shared/useUpdateTechnicalContact'
interface Props {
  administrativeContact: Contact
  organisationId: string
}

export const DocumentProviderAdministrativeContactForm: FC<Props> = ({
  administrativeContact,
  organisationId,
}) => {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors } = useForm()
  const {
    updateAdministrativeContact,
    loading,
  } = useUpdateAdministrativeContact(organisationId)

  const onSubmit = (data: { administrativeContact: Contact }) => {
    if (data?.administrativeContact) {
      const input: ContactInput = {
        ...data.administrativeContact,
        id: administrativeContact.id,
      }
      updateAdministrativeContact(input)
    }
  }
  return (
    <Box marginY={3}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom={4}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {formatMessage(m.SingleProviderResponsibleContactHeading)}
            </Text>
          </Box>
          <DocumentProviderInput
            control={control}
            name="administrativeContact.name"
            defaultValue={administrativeContact?.name}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderResponsibleContactNameError,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderResponsibleContactNameLabel)}
            placeholder={formatMessage(
              m.SingleProviderResponsibleContactNamePlaceholder,
            )}
            hasError={errors.administrativeContact?.name}
            errorMessage={errors.administrativeContact?.name?.message}
          />
          <DocumentProviderInput
            control={control}
            name="administrativeContact.email"
            defaultValue={administrativeContact?.email}
            rules={{
              required: {
                value: true,
                message: formatMessage(m.SingleProviderInstitutionEmailError),
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: formatMessage(
                  m.SingleProviderInstitutionEmailFormatError,
                ),
              },
            }}
            label={formatMessage(m.SingleProviderResponsibleContactEmailLabel)}
            placeholder={formatMessage(
              m.SingleProviderResponsibleContactEmailPlaceholder,
            )}
            hasError={errors.administrativeContact?.email}
            errorMessage={errors.administrativeContact?.email?.message}
          />
          <DocumentProviderInput
            control={control}
            name="administrativeContact.phoneNumber"
            defaultValue={administrativeContact?.phoneNumber}
            rules={{
              required: {
                value: true,
                message: formatMessage(
                  m.SingleProviderResponsibleContactPhonenumberError,
                ),
              },
              minLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderResponsibleContactPhonenumberErrorLength,
                ),
              },
              maxLength: {
                value: 7,
                message: formatMessage(
                  m.SingleProviderResponsibleContactPhonenumberErrorLength,
                ),
              },
              pattern: {
                value: /^\d+$/,
                message: formatMessage(
                  m.SingleProviderResponsibleContactPhonenumberErrorOnlyNumbers,
                ),
              },
            }}
            label={formatMessage(
              m.SingleProviderResponsibleContactPhoneNumberLabel,
            )}
            placeholder={formatMessage(
              m.SingleProviderResponsibleContactPhoneNumberPlaceholder,
            )}
            hasError={errors.administrativeContact?.phoneNumber}
            errorMessage={errors.administrativeContact?.phoneNumber?.message}
          />
          <Box
            display="flex"
            justifyContent="flexEnd"
            alignItems="center"
            flexDirection="row"
            marginTop={2}
          >
            <Button
              type="submit"
              variant="primary"
              icon="arrowForward"
              loading={loading}
            >
              {formatMessage(m.SingleProviderSaveButton)}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}
