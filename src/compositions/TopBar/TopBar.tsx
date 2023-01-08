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
  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState<boolean>(false);

  return (
    <div className={`top-bar ${className} ${mobileMenuIsVisible ? 'top-bar__mobile' : ''}`}>
      <IconButton
        hideLabel
        icon="airswap"
        text="AirSwap button"
        className="top-bar__airswap-button"
      />
      <IconButton
        hideLabel
        icon={!mobileMenuIsVisible ? 'menu' : 'close'}
        text="Menu button"
        onClick={() => setMobileMenuIsVisible(!mobileMenuIsVisible)}
        className="top-bar__menu-button"
        iconClassName={mobileMenuIsVisible ? 'top-bar__close-icon' : ''}
      />
      <IconNavLink
        icon="plus"
        text="List"
        to={`/${AppRoutes.listNft}`}
        className="top-bar__list-button"
        iconClassName="top-bar__list-button-icon"
      />
      <MobileMenu isHidden={!mobileMenuIsVisible} className="top-bar__mobile-menu" />
    </div>
  );
};

export default TopBar;
