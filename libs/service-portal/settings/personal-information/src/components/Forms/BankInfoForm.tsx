import React, { FC } from 'react'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale, useNamespaces } from '@island.is/localization'
import { HookFormType } from '../Forms/ProfileForm/types/form'

interface Props {
  bankInfo: string
  hookFormData: HookFormType
}

export const BankInfoForm: FC<Props> = ({ hookFormData }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  const { control, errors } = hookFormData

  return (
    <InputController
      control={control}
      id="bankInfo"
      name="bankInfo"
      format="####-##-######"
      placeholder="0000-00-000000"
      label="Reikningsupplýsingar"
      error={errors.bankInfo?.message}
      required={false}
      size="xs"
      rules={{
        minLength: {
          value: 12,
          message: formatMessage({
            id: 'sp.settings:bankInfo-required-length-msg',
            defaultMessage: `Reikningsupplýsingar eru 12 tölustafir á lengd.
                  Banki 4 stafir, höfuðbók 2 stafir, reikningsnúmer 6 stafir.`,
          }),
        },
        pattern: {
          value: /^\d+$/,
          message: formatMessage({
            id: 'sp.settings:only-numbers-allowed',
            defaultMessage: 'Eingöngu tölustafir eru leyfðir',
          }),
        },
      }}
    />
  )
}
