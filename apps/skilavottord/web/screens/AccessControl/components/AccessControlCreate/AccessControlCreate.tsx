import React, { FC } from 'react'
import { useForm } from 'react-hook-form'

import { Option } from '@island.is/island-ui/core'
import { ModalProps } from '@island.is/skilavottord-web/components'
import { CreateAccessControlInput } from '@island.is/skilavottord-web/graphql/schema'

import { AccessControlModal } from '../AccessControlModal/AccessControlModal'

interface AccessControlCreateProps
  extends Omit<
    ModalProps,
    'onContinue' | 'continueButtonText' | 'cancelButtonText'
  > {
  onSubmit: (partner: CreateAccessControlInput) => Promise<void>
  recyclingPartners: Option[]
  roles: Option[]
}

export const AccessControlCreate: FC<AccessControlCreateProps> = ({
  title,
  text,
  show,
  onCancel,
  onSubmit,
  recyclingPartners,
  roles,
}) => {
  const { control, errors, handleSubmit } = useForm({
    mode: 'onChange',
  })

  const handleOnSubmit = handleSubmit(
    ({ nationalId, name, role, partnerId }) => {
      return onSubmit({
        nationalId,
        name,
        role: role.value,
        partnerId: partnerId.value,
      })
    },
  )

  return (
    <AccessControlModal
      title={title}
      text={text}
      show={show}
      onCancel={onCancel}
      onSubmit={handleOnSubmit}
      recyclingPartners={recyclingPartners}
      roles={roles}
      control={control}
      errors={errors}
    />
  )
}
