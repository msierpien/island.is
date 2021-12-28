import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { useWindowSize } from 'react-use'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import {
  Box,
  Stack,
  Button,
  Checkbox,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  ProcessPageLayout,
  CarDetailsBox,
} from '@island.is/skilavottord-web/components'
import { formatDate, formatYear } from '@island.is/skilavottord-web/utils'
import { Mutation } from '@island.is/skilavottord-web/graphql/schema'
import { UserContext } from '@island.is/skilavottord-web/context'
import { ACCEPTED_TERMS_AND_CONDITION } from '@island.is/skilavottord-web/utils/consts'
import { BASE_PATH } from '@island.is/skilavottord/consts'
import { dateFormat } from '@island.is/shared/constants'

const SkilavottordVehicleOwnerMutation = gql`
  mutation skilavottordVehicleOwnerMutation($name: String!) {
    createSkilavottordVehicleOwner(name: $name)
  }
`

const SkilavottordVehicleMutation = gql`
  mutation skilavottordVehicleMutation(
    $vinNumber: String!
    $newRegDate: DateTime!
    $color: String!
    $type: String!
    $permno: String!
  ) {
    createSkilavottordVehicle(
      vinNumber: $vinNumber
      newRegDate: $newRegDate
      color: $color
      type: $type
      permno: $permno
    )
  }
`

interface PropTypes {
  apolloState: any
}

const Confirm = ({ apolloState }: PropTypes) => {
  const { user } = useContext(UserContext)
  const [checkbox, setCheckbox] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const { width } = useWindowSize()

  const {
    t: { confirm: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const car = apolloState[`VehicleInformation:${id}`]

  useEffect(() => {
    if (!car) {
      router.push({
        pathname: `${routes.myCars}`,
      })
    }
  }, [car, router, routes])

  useEffect(() => {
    if (width < theme.breakpoints.lg) {
      return setIsTablet(true)
    }
    setIsTablet(false)
  }, [width])

  const [
    createSkilavottordVehicle,
    { loading: createSkilavottordVehicleLoading },
  ] = useMutation<Mutation>(SkilavottordVehicleMutation)
  const [
    createSkilavottordVehicleOwner,
    { loading: createSkilavottordVehicleOwnerLoading },
  ] = useMutation<Mutation>(SkilavottordVehicleOwnerMutation)

  const loading =
    createSkilavottordVehicleLoading || createSkilavottordVehicleOwnerLoading

  const onCancel = () => {
    router.replace({
      pathname: routes.myCars,
    })
  }

  const onConfirm = async () => {
    localStorage.setItem(ACCEPTED_TERMS_AND_CONDITION, (id || '').toString())
    const { errors } = await createSkilavottordVehicleOwner({
      variables: {
        name: user?.name,
      },
    })
    if (errors && errors.length > 0) {
      toast.error(errors.join('\n'))
    }

    await createSkilavottordVehicle({
      variables: {
        ...car,
        newRegDate: formatDate(car.firstRegDate, dateFormat.is),
      },
    })
    router.replace(`${routes.recycleVehicle.baseRoute}/${id}/handover`)
  }

  const checkboxLabel = (
    <>
      <Text fontWeight={!checkbox ? 'light' : 'medium'}>
        {t.checkbox.label}{' '}
        <a href="https://island.is/skilmalar-island-is">
          {t.checkbox.linkLabel}
        </a>
      </Text>
    </>
  )

  return (
    <>
      {car && (
        <ProcessPageLayout
          processType={'citizen'}
          activeSection={0}
          activeCar={id?.toString()}
        >
          <Stack space={4}>
            <Text variant="h1">{t.title}</Text>
            <Stack space={2}>
              <Text variant="h3">{t.subTitles.confirm}</Text>
              <Text>{t.info}</Text>
            </Stack>
            <Stack space={2}>
              <CarDetailsBox
                vehicleId={car.permno}
                vehicleType={car.type}
                modelYear={formatYear(car.firstRegDate, dateFormat.is)}
              />
              <Box padding={4} background="blue100" borderRadius="large">
                <Checkbox
                  name="confirm"
                  label={checkboxLabel.props.children}
                  onChange={({ target }) => {
                    setCheckbox(target.checked)
                  }}
                  checked={checkbox}
                  disabled={!car.isRecyclable}
                />
              </Box>
            </Stack>
            <Box
              width="full"
              display="inlineFlex"
              justifyContent="spaceBetween"
            >
              {isTablet ? (
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  circle
                  size="large"
                  icon="arrowBack"
                />
              ) : (
                <Button variant="ghost" onClick={onCancel}>
                  {t.buttons.cancel}
                </Button>
              )}
              <Button
                disabled={!checkbox}
                loading={loading}
                icon="arrowForward"
                onClick={onConfirm}
              >
                {t.buttons.continue}
              </Button>
            </Box>
          </Stack>
        </ProcessPageLayout>
      )}
    </>
  )
}

export default Confirm
