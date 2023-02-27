import React, { FC } from 'react';

import classNames from 'classnames';

import Button from '../../../../components/Button/Button';
import { SelectOption } from '../../../../types/SelectOption';

import './DropdownButton.scss';

type HTMLButtonProps = Omit<JSX.IntrinsicElements['button'], 'ref'>;

interface DropdownButtonProps extends HTMLButtonProps {
  isActive: boolean;
  option: SelectOption;
  className?: string;
}

const DropdownButton: FC<DropdownButtonProps> = ({
  isActive,
  option,
  className = '',
  ...props
}) => {
  const buttonClassName = classNames('dropdown-button', {
    'dropdown-button--is-active': isActive,
  }, className);

  return (
    <Button
      {...props}
      text={option.label}
      className={buttonClassName}
    />
  );
};

export default DropdownButton;
