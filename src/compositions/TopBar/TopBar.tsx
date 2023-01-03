import React, { FC } from 'react';

import Button from '../../components/Button/Button';
import IconButton from '../IconButton/IconButton';

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
    <Button text="list" />
  </div>
);

export default TopBar;
