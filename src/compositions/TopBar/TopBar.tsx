import React, { FC, useState } from 'react';

import { AppRoutes } from '../../routes';
import IconButton from '../IconButton/IconButton';
import IconNavLink from '../IconNavLink/IconNavLink';
import MobileMenu from './MobileMenu/MobileMenu';

import './TopBar.scss';

interface TopBarProps {
  className?: string;
}

const TopBar: FC<TopBarProps> = ({ className = '' }) => {
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  return (
    <>
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
          onClick={() => setDisplayMenu(!displayMenu)}
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

      <MobileMenu displayMenu={displayMenu} />
    </>
  );
};

export default TopBar;
