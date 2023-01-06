import React, { FC } from 'react';

import { AppRoutes } from '../../routes';
import IconButton from '../IconButton/IconButton';
import IconNavLink from '../IconNavLink/IconNavLink';

import './TopBar.scss';

interface TopBarProps {
  className?: string;
}

const TopBar: FC<TopBarProps> = ({ className = '' }) => (
  <div className={`top-bar ${className}`}>
    <IconButton
      hideLabel
      icon="airswap"
      text="AirSwap button"
      className="top-bar__airswap-button"
    />
    <IconButton
      hideLabel
      icon="menu"
      text="Menu button"
      className="top-bar__menu-button"
    />
    <IconNavLink
      icon="plus"
      text="List"
      to={`/${AppRoutes.listNft}`}
      className="top-bar__list-button"
      iconClassName="top-bar__list-button-icon"
    />
  </div>
);

export default TopBar;
