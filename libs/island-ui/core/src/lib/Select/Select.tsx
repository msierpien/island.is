import React from 'react'
import cn from 'classnames'
import ReactSelect, {
  OptionsType,
  GroupedOptionsType,
  ActionMeta,
  ValueType,
} from 'react-select'
import CreatableReactSelect from 'react-select/creatable'
import { formatGroupLabel } from 'react-select/src/builtins'
import {
  Option,
  Menu,
  IndicatorsContainer,
  Control,
  DropdownIndicator,
  Input,
  Placeholder,
  SingleValue,
  ValueContainer,
  customStyles,
} from './Components'
import { InputBackgroundColor } from '../Input/types'
import * as styles from './Select.css'

interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

export type Option = {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps {
  name: string
  options: OptionsType<Option> | GroupedOptionsType<Option>
  id?: string
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  noOptionsMessage?: string
  onChange?: ((
    value: ValueType<Option>,
    actionMeta: ActionMeta<Option>,
  ) => void) &
    ((value: ValueType<Option>, action: ActionMeta<Option>) => void)
  label?: string
  value?: ValueType<Option>
  placeholder?: string
  defaultValue?: Option
  icon?: string
  isSearchable?: boolean
  isCreatable?: boolean
  size?: 'sm' | 'md'
  backgroundColor?: InputBackgroundColor
  required?: boolean
  ariaError?: AriaError
  formatGroupLabel?: formatGroupLabel<Option>
}

export const Select = ({
  name,
  id = name,
  disabled,
  noOptionsMessage,
  options,
  onChange,
  label,
  value,
  hasError = false,
  errorMessage = '',
  placeholder = '',
  defaultValue,
  icon = 'chevronDown',
  isSearchable = true,
  isCreatable = false,
  size = 'md',
  backgroundColor = 'white',
  required,
  formatGroupLabel,
}: SelectProps) => {
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : {}
  const [currentValue, setCurrentValue] = React.useState('')

  return isCreatable ? (
    <div
      className={cn(styles.wrapper, styles.wrapperColor[backgroundColor])}
      data-testid={`creatable-select-${name}`}
    >
      <CreatableReactSelect
        instanceId={id}
        noOptionsMessage={() => noOptionsMessage || null}
        id={id}
        name={name}
        isDisabled={disabled}
        options={options}
        styles={customStyles}
        classNamePrefix="island-select"
        onChange={onChange}
        label={label}
        value={value}
        icon={icon}
        placeholder={placeholder}
        defaultValue={defaultValue}
        isOptionDisabled={(option) => !!option.disabled}
        hasError={hasError}
        isSearchable={isSearchable}
        size={size}
        required={required}
        ariaError={ariaError as AriaError}
        formatGroupLabel={formatGroupLabel}
        formatCreateLabel={() => currentValue}
        createOptionPosition="first"
        onInputChange={(inputValue) => setCurrentValue(inputValue)}
        components={{
          Control,
          Input,
          Placeholder,
          ValueContainer,
          SingleValue,
          DropdownIndicator,
          IndicatorsContainer,
          Menu,
          Option,
        }}
        isClearable
        backspaceRemovesValue
      />
      {hasError && errorMessage && (
        <div id={errorId} className={styles.errorMessage} aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </div>
  ) : (
    <div
      className={cn(styles.wrapper, styles.wrapperColor[backgroundColor])}
      data-testid={`select-${name}`}
    >
      <ReactSelect
        instanceId={id}
        noOptionsMessage={() => noOptionsMessage || null}
        id={id}
        name={name}
        isDisabled={disabled}
        options={options}
        styles={customStyles}
        classNamePrefix="island-select"
        onChange={onChange}
        label={label}
        value={value}
        icon={icon}
        placeholder={placeholder}
        defaultValue={defaultValue}
        isOptionDisabled={(option) => !!option.disabled}
        hasError={hasError}
        isSearchable={isSearchable}
        size={size}
        required={required}
        ariaError={ariaError as AriaError}
        formatGroupLabel={formatGroupLabel}
        components={{
          Control,
          Input,
          Placeholder,
          ValueContainer,
          SingleValue,
          DropdownIndicator,
          IndicatorsContainer,
          Menu,
          Option,
        }}
      />
      {hasError && errorMessage && (
        <div id={errorId} className={styles.errorMessage} aria-live="assertive">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
