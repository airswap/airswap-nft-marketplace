import React, { FC } from 'react';

import classNames from 'classnames';

import Button from '../../components/Button/Button';
import { truncateAddress } from '../../helpers/stringUtils';
import { AppRoutes } from '../../routes';
import IconButton from '../IconButton/IconButton';
import IconNavLink from '../IconNavLink/IconNavLink';
import UserPopup from '../UserPopup/UserPopup';
import DesktopNav from './subcomponents/DesktopNav/DesktopNav';

import './TopBar.scss';

interface TopBarProps {
  mobileMenuIsVisible: boolean;
  showDesktopConnectButton: boolean;
  showDesktopUserButton: boolean;
  account: string | null | undefined;
  onConnectButtonClick: () => void;
  onMobileMenuButtonClick: () => void;
  className?: string;
}

const TopBar: FC<TopBarProps> = ({
  mobileMenuIsVisible,
  showDesktopConnectButton,
  showDesktopUserButton,
  account,
  onConnectButtonClick,
  onMobileMenuButtonClick,
  className = '',
}) => {
  const containerClassName = classNames('top-bar', {
    'top-bar--mobile-menu-is-visible': mobileMenuIsVisible,
  }, className);
  const truncatedAddress = truncateAddress(account || '');

  return (
    <div>
      <div className={containerClassName}>
        <IconNavLink
          hideLabel
          icon="airswap"
          text="AirSwap button"
          to="/"
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
        <DesktopNav className="top-bar__desktop-nav" />
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
          {showDesktopUserButton && <IconButton icon="logout" text={truncatedAddress} />}
        </div>
      </div>
      <UserPopup isENS={false} address={truncatedAddress} />
    </div>
  );
};


export default TopBar;
