import React, { FC } from 'react';

import classNames from 'classnames';

import Button, { ButtonProps } from '../../components/Button/Button';
import Icon, { IconSet } from '../../components/Icon/Icon';

import './IconButton.scss';

interface IconButtonProps extends ButtonProps {
  hideLabel?: boolean;
  icon: keyof IconSet;
  iconAlign?: 'left' | 'right';
  iconClassName?: string;
  className?: string;
}

const IconButton: FC<IconButtonProps> = ({
  hideLabel,
  icon,
  iconAlign = 'left',
  text,
  iconClassName,
  className = '',
  ...restProps
}) => {
  const iconButtonClassName = classNames('icon-button', {
    'icon-button--hidden-label': hideLabel,
    [`icon-button--icon-align-${iconAlign}`]: iconAlign,
  }, className);

  return (
    <Button
      {...restProps}
      text={text}
      className={iconButtonClassName}
    >
      <Icon name={icon} className={`icon-button__icon ${iconClassName}`} />
      {!hideLabel && text}
    </Button>
  );
};

export default IconButton;
