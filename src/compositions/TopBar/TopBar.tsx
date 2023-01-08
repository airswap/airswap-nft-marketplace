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

  const topBarClassName = classNames('top-bar', {
    'top-bar__mobile': mobileMenuIsVisible,
  }, className);

  const closeIconClassName = classNames('', {
    'top-bar__close-icon': mobileMenuIsVisible,
  });

  const handleIconButtonClick = (): void => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  };

  return (
    <div className={topBarClassName}>
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
        iconClassName={closeIconClassName}
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
