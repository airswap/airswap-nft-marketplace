import React, { FC, useState } from 'react';

import classNames from 'classnames';

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

  const containerClassName = classNames('top-bar', {
    'top-bar--mobile-menu-is-visible': mobileMenuIsVisible,
  }, className);

  const handleIconButtonClick = (): void => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  };

  return (
    <div className={containerClassName}>
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
        onClick={handleIconButtonClick}
        className="top-bar__menu-button"
        iconClassName="top-bar__menu-button-icon"
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
