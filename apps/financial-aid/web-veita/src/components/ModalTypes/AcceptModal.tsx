import React, { useContext, useMemo, useState } from 'react'

import {
  InputModal,
  NumberInput,
} from '@island.is/financial-aid-web/veita/src/components'

import { AdminContext } from '@island.is/financial-aid-web/veita/src/components/AdminProvider/AdminProvider'
import {
  aidCalculator,
  Amount,
  calculateAcceptedAidFinalAmount,
  calculateTaxOfAmount,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import format from 'date-fns/format'
import { Box, Button, Input, Text } from '@island.is/island-ui/core'
import cn from 'classnames'

import * as modalStyles from './ModalTypes.css'
import { useRouter } from 'next/router'

interface Props {
  onCancel: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSaveApplication: (amount: Amount) => void
  isModalVisable: boolean
  homeCircumstances: HomeCircumstances
  spouseNationalId?: string
}

interface calculationsState {
  amount: number
  income?: number
  personalTaxCreditPercentage?: number
  tax: number
  secondPersonalTaxCredit: number
  showSecondPersonalTaxCredit: boolean
  hasError: boolean
  hasSubmitError: boolean
  deductionFactor: Array<{ description: string; amount: number }>
}

const AcceptModal = ({
  onCancel,
  onSaveApplication,
  isModalVisable,
  homeCircumstances,
  spouseNationalId,
}: Props) => {
  const router = useRouter()

  const maximumInputLength = 6

  const currentYear = format(new Date(), 'yyyy')

  const { municipality } = useContext(AdminContext)

  const aidAmount = useMemo(() => {
    if (municipality && homeCircumstances) {
      return aidCalculator(
        homeCircumstances,
        spouseNationalId
          ? municipality.cohabitationAid
          : municipality.individualAid,
      )
    }
  }, [homeCircumstances, municipality])

  if (!aidAmount) {
    return (
      <Text color="red400">
        Útreikingur fyrir aðstoð misstókst, vinsamlegast reyndu aftur
      </Text>
    )
  }

  const [state, setState] = useState<calculationsState>({
    amount: aidAmount,
    income: undefined,
    personalTaxCreditPercentage: undefined,
    tax: calculateTaxOfAmount(aidAmount, currentYear),
    secondPersonalTaxCredit: 0,
    showSecondPersonalTaxCredit: false,
    deductionFactor: [],
    hasError: false,
    hasSubmitError: false,
  })

  const sumValues = (deductionFactor: calculationsState['deductionFactor']) =>
    deductionFactor
      .map((item) => {
        return item.amount
      })
      .reduce((a, b) => {
        return a + b
      }, 0)

  const checkingValue = (element?: number) => (element ? element : 0)

  const finalAmount = calculateAcceptedAidFinalAmount(
    aidAmount - checkingValue(state.income) - sumValues(state.deductionFactor),
    currentYear,
    checkingValue(state.personalTaxCreditPercentage),
    state.secondPersonalTaxCredit,
  )

  const areRequiredFieldsFilled =
    state.income === undefined ||
    state.personalTaxCreditPercentage === undefined ||
    !finalAmount ||
    finalAmount === 0

  const submit = async () => {
    if (areRequiredFieldsFilled) {
      setState({ ...state, hasError: true })
      return
    }

    onSaveApplication({
      applicationId: router.query.id as string,
      aidAmount: state.amount,
      income: state.income,
      personalTaxCredit: state.personalTaxCreditPercentage ?? 0,
      spousePersonalTaxCredit: state.secondPersonalTaxCredit,
      tax: state.tax,
      finalAmount: finalAmount,
      deductionFactors: state.deductionFactor,
    })
  }

  return (
    <InputModal
      headline="Umsóknin þín er samþykkt og áætlun er tilbúin"
      onCancel={onCancel}
      onSubmit={submit}
      submitButtonText="Samþykkja"
      isModalVisable={isModalVisable}
      hasError={state.hasSubmitError}
      errorMessage={'Eitthvað fór úrskeiðis, vinsamlega reynið aftur síðar'}
    >
      <Box marginBottom={3}>
        <NumberInput
          label="Grunnupphæð"
          placeholder="Sláðu inn upphæð útborgunar"
          id="amountInput"
          name="amountInput"
          value={state.amount.toString()}
          onUpdate={(input) => {
            setState({ ...state, amount: input, hasError: false })
          }}
          maximumInputLength={maximumInputLength}
        />
      </Box>

      <Box marginBottom={3}>
        <NumberInput
          label="Tekjur"
          placeholder="Sláðu inn upphæð"
          id="income"
          name="income"
          value={state?.income ? state?.income.toString() : ''}
          onUpdate={(input) => {
            setState({ ...state, income: input, hasError: false })
          }}
          maximumInputLength={maximumInputLength}
          hasError={state.hasError && state.income === undefined}
        />
      </Box>

      {state.deductionFactor.map((item, index) => {
        return (
          <Box
            className={modalStyles.deductionFactor}
            key={`deductionFactor-${index}`}
          >
            <Input
              label="Lýsing"
              placeholder="Sláðu inn lýsingu"
              id={`description-${index}`}
              name={`description-${index}`}
              value={state.deductionFactor[index].description}
              onChange={(e) => {
                setState({
                  ...state,
                  hasError: false,
                  deductionFactor: [...state.deductionFactor].map((object) => {
                    if (object === item) {
                      return {
                        ...object,
                        description: e.target.value,
                      }
                    } else return object
                  }),
                })
              }}
              backgroundColor="blue"
            />

            <NumberInput
              label="Upphæð frádráttar"
              placeholder="Sláðu inn upphæð"
              id={`amount-${index}`}
              name={`amount-${index}`}
              value={state.deductionFactor[index].amount.toString()}
              onUpdate={(input) => {
                setState({
                  ...state,
                  hasError: false,
                  deductionFactor: [...state.deductionFactor].map((object) => {
                    if (object === item) {
                      return {
                        ...object,
                        amount: input,
                      }
                    } else return object
                  }),
                })
              }}
              maximumInputLength={maximumInputLength}
            />

            <Button
              circle
              icon="remove"
              onClick={() => {
                setState({
                  ...state,
                  deductionFactor: state.deductionFactor.filter(
                    (el) => el !== item,
                  ),
                })
              }}
              size="small"
              variant="ghost"
            />
          </Box>
        )
      })}

      <Box marginBottom={3}>
        <Button
          icon="add"
          onClick={() => {
            setState({
              ...state,
              hasError: false,
              deductionFactor: [
                ...state.deductionFactor,
                { description: '', amount: 0 },
              ],
            })
          }}
          variant="text"
        >
          Bættu við frádráttarlið
        </Button>
      </Box>

      <Box marginBottom={3}>
        <Input
          label="Persónuafsláttur"
          placeholder="Sláðu inn prósentuhlutfall"
          id="personalTaxCredit"
          name="personalTaxCredit"
          value={Number(state.personalTaxCreditPercentage).toString()}
          type="number"
          onChange={(e) => {
            if (e.target.value.length <= 3 && Number(e.target.value) <= 100) {
              setState({
                ...state,
                hasError: false,
                personalTaxCreditPercentage: Number(e.target.value),
              })
            }
          }}
          backgroundColor="blue"
          hasError={
            state.hasError && state.personalTaxCreditPercentage === undefined
          }
        />
      </Box>

      {state.showSecondPersonalTaxCredit && (
        <Box marginBottom={3}>
          <Input
            label="Persónuafsláttur"
            placeholder="Sláðu inn prósentuhlutfall"
            id="secondPersonalTaxCredit"
            name="secondPersonalTaxCredit"
            value={Number(state.secondPersonalTaxCredit).toString()}
            type="number"
            onChange={(e) => {
              if (e.target.value.length <= 3 && Number(e.target.value) <= 100) {
                setState({
                  ...state,
                  hasError: false,
                  secondPersonalTaxCredit: Number(e.target.value),
                })
              }
            }}
            backgroundColor="blue"
          />
        </Box>
      )}

      <Box marginBottom={3}>
        <Button
          icon={state.showSecondPersonalTaxCredit ? 'remove' : 'add'}
          onClick={() => {
            setState({
              ...state,
              showSecondPersonalTaxCredit: !state.showSecondPersonalTaxCredit,
            })
          }}
          variant="text"
        >
          {state.showSecondPersonalTaxCredit
            ? 'Fjarlægðu skattkorti'
            : 'Bættu við skattkorti'}
        </Button>
      </Box>

      <Box marginBottom={[3, 3, 5]}>
        <Input
          label="Skattur "
          id="tax"
          name="tax"
          value={calculateTaxOfAmount(
            (aidAmount || 0) -
              checkingValue(state.income) -
              sumValues(state.deductionFactor),
            currentYear,
          ).toLocaleString('de-DE')}
          readOnly={true}
        />
      </Box>

      <div
        className={cn({
          [`errorMessage`]: true,
          [`showErrorMessage`]: state.hasError,
        })}
      >
        <Text color="red600" fontWeight="semiBold" variant="small">
          Þú þarft að fylla út alla reiti
        </Text>
      </div>

      <Text variant="h3" marginBottom={3}>
        Útreikningur
      </Text>

      <Box
        display="flex"
        justifyContent="spaceBetween"
        background="blue100"
        borderTopWidth="standard"
        borderBottomWidth="standard"
        borderColor="blue200"
        paddingY={2}
        paddingX={3}
        marginBottom={2}
      >
        <Text variant="small">Upphæð aðstoðar</Text>
        <Text>{finalAmount.toLocaleString('de-DE')} kr.</Text>
      </Box>
    </InputModal>
  )
}

export default AcceptModal
