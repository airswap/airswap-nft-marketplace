import React, { FC } from 'react';

import classNames from 'classnames';

import Button from '../../components/Button/Button';
import { AppRoutes } from '../../routes';
import IconButton from '../IconButton/IconButton';
import IconNavLink from '../IconNavLink/IconNavLink';

import './TopBar.scss';

interface TopBarProps {
  mobileMenuIsVisible: boolean;
  showDesktopConnectButton: boolean;
  onConnectButtonClick: () => void;
  onMobileMenuButtonClick: () => void;
  className?: string;
}

const TopBar: FC<TopBarProps> = ({
  mobileMenuIsVisible,
  showDesktopConnectButton,
  onConnectButtonClick,
  onMobileMenuButtonClick,
  className = '',
}) => {
  const containerClassName = classNames('top-bar', {
    'top-bar--mobile-menu-is-visible': mobileMenuIsVisible,
  }, className);

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
        onClick={onMobileMenuButtonClick}
        className="top-bar__menu-button"
        iconClassName="top-bar__menu-button-icon"
      />
      <div className="top-bar__list-button-and-wallet-button-wrapper">
        <IconNavLink
          icon="plus"
          text="List"
          to={`/${AppRoutes.listNft}`}
          className="top-bar__list-button"
          iconClassName="top-bar__list-button-icon"
        />
        {showDesktopConnectButton && (
          <Button
            text="Connect"
            onClick={onConnectButtonClick}
            className="top-bar__connect-button"
          />
        )}
      </div>
    </div>
  );
};

export default TopBar;
