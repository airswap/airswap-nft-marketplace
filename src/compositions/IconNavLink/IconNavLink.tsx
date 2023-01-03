import React, { FC } from 'react';

import classNames from 'classnames';
import { NavLink, NavLinkProps } from 'react-router-dom';

import Icon, { IconSet } from '../../components/Icon/Icon';

import './IconNavLink.scss';

interface IconNavLinkProps extends NavLinkProps {
  hideLabel?: boolean;
  icon: keyof IconSet;
  iconAlign?: 'left' | 'right';
  iconClassName?: string;
  text: string;
  className?: string;
}

const IconNavLink: FC<IconNavLinkProps> = ({
  hideLabel,
  icon,
  iconAlign = 'left',
  text,
  iconClassName,
  className = '',
  ...restProps
}) => {
  const iconButtonClassName = classNames('nav-link-button', {
    'nav-link-button--hidden-label': hideLabel,
    [`nav-link-button--icon-align-${iconAlign}`]: iconAlign,
  }, className);

  return (
    <NavLink
      {...restProps}
      className={iconButtonClassName}
    >
      <Icon name={icon} className={`nav-link-button__icon ${iconClassName}`} />
      {!hideLabel && text}
    </NavLink>
  );
};

export default IconNavLink;
