import React, { FC } from 'react';

import classNames from 'classnames';

import Icon from '../Icon/Icon';

import './Checkbox.scss';

export type HTMLInputProps = JSX.IntrinsicElements['input'];

export interface CheckboxProps extends Omit<HTMLInputProps, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  checkClassName?: string;
  className?: string;
  labelClassName?: string;
}

const Checkbox: FC<CheckboxProps> = ({
  checked,
  disabled,
  label,
  value,
  onChange,
  checkClassName = '',
  className = '',
  labelClassName = '',
  ...checkboxProps
}) => {
  const handleChange = (): void => {
    onChange(value);
  };

  const checkboxClassNames = classNames('checkbox', {
    'checkbox--is-disabled': disabled,
  }, className);

  return (
    <label id={label} className={checkboxClassNames}>
      <input
        {...checkboxProps}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="checkbox__input"
      />

      <div className={`checkbox__box ${checkClassName}`}>
        <Icon name="check" className="checkbox__icon" />
      </div>

      <span className={`checkbox__label ${labelClassName}`}>{label}</span>
    </label>
  );
};

export default Checkbox;
