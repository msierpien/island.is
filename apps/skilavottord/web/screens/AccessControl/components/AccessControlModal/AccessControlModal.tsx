import React, { BaseSyntheticEvent, FC } from 'react'
import { Control, Controller } from 'react-hook-form'
import { FieldError, FieldValues } from 'react-hook-form/dist/types/form'
import { DeepMap } from 'react-hook-form/dist/types/utils'
import * as kennitala from 'kennitala'

import { Box, Button, Select, Option, Stack } from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { Modal, ModalProps } from '@island.is/skilavottord-web/components'
import { useI18n } from '@island.is/skilavottord-web/i18n'

interface AccessControlModalProps
  extends Omit<
    ModalProps,
    'onContinue' | 'continueButtonText' | 'cancelButtonText'
  > {
  onSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>
  recyclingPartners: Option[]
  roles: Option[]
  errors: DeepMap<FieldValues, FieldError>
  control: Control<FieldValues>
  nationalIdDisabled?: boolean
  partnerIdRequired?: boolean
}

export const AccessControlModal: FC<AccessControlModalProps> = ({
  title,
  text,
  show,
  onCancel,
  onSubmit,
  recyclingPartners,
  roles,
  nationalIdDisabled = false,
  partnerIdRequired = false,
  errors,
  control,
}) => {
  const {
    t: { accessControl: t },
  } = useI18n()

  return (
    <Modal
      title={title}
      text={text}
      show={show}
      onCancel={onCancel}
      onContinue={() => {
        // Intentionally left empty
      }}
      continueButtonText={t.modal.buttons.continue}
      cancelButtonText={t.modal.buttons.cancel}
    >
      <form onSubmit={onSubmit}>
        <Stack space={3}>
          <InputController
            id="nationalId"
            control={control}
            required
            label={t.modal.inputs.nationalId.label}
            placeholder={t.modal.inputs.nationalId.placeholder}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.nationalId.rules?.required,
              },
              validate: {
                value: (value: number) => {
                  if (
                    value.toString().length === 10 &&
                    !kennitala.isPerson(value)
                  ) {
                    return t.modal.inputs.nationalId.rules?.validate
                  }
                },
              },
            }}
            type="tel"
            format="######-####"
            error={errors?.nationalId?.message}
            backgroundColor="blue"
            disabled={nationalIdDisabled}
          />
          <InputController
            id="name"
            control={control}
            required
            label={t.modal.inputs.name.label}
            placeholder={t.modal.inputs.name.placeholder}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.name.rules?.required,
              },
            }}
            error={errors?.name?.message}
            backgroundColor="blue"
          />
          <InputController
            id="email"
            control={control}
            required
            label={t.modal.inputs.email.label}
            placeholder={t.modal.inputs.email.placeholder}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.email.rules?.required,
              },
              pattern: {
                value: /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i,
                message: t.modal.inputs.email.rules?.validate,
              },
            }}
            error={errors?.email?.message}
            backgroundColor="blue"
          />
          <InputController
            id="phone"
            control={control}
            required
            label={t.modal.inputs.phone.label}
            placeholder={t.modal.inputs.phone.placeholder}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.phone.rules?.required,
              },
            }}
            type="tel"
            error={errors?.phone?.message}
            backgroundColor="blue"
          />
          <Controller
            name="role"
            control={control}
            rules={{
              required: {
                value: true,
                message: t.modal.inputs.role.rules?.required,
              },
            }}
            render={({ onChange, value, name }) => {
              return (
                <Select
                  required
                  name={name}
                  label={t.modal.inputs.role.label}
                  placeholder={t.modal.inputs.role.placeholder}
                  size="md"
                  value={value}
                  hasError={!!errors?.role?.message}
                  errorMessage={errors?.role?.message}
                  backgroundColor="blue"
                  options={roles}
                  onChange={onChange}
                />
              )
            }}
          />
          <Controller
            name="partnerId"
            control={control}
            rules={
              partnerIdRequired
                ? {
                    required: {
                      value: true,
                      message: t.modal.inputs.partner.rules?.required,
                    },
                  }
                : {}
            }
            render={({ onChange, value, name }) => {
              return (
                <Select
                  name={name}
                  label={t.modal.inputs.partner.label}
                  placeholder={t.modal.inputs.partner.placeholder}
                  size="md"
                  value={value}
                  hasError={!!errors?.partnerId?.message}
                  errorMessage={errors?.partnerId?.message}
                  backgroundColor="blue"
                  options={recyclingPartners}
                  onChange={onChange}
                  required={partnerIdRequired}
                  isCreatable
                />
              )
            }}
          />
        </Stack>
        <Box display="flex" justifyContent="spaceBetween" marginTop={7}>
          <Button variant="ghost" onClick={onCancel} fluid>
            {t.modal.buttons.cancel}
          </Button>
          <Box paddingX={[3, 3, 3, 15]}></Box>
          <Button type="submit" fluid>
            {t.modal.buttons.continue}
          </Button>
        </Box>
      </form>
    </Modal>
  )
}
