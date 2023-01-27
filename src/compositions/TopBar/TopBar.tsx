import React, {
  FC, useEffect, useRef, useState,
} from 'react';

import classNames from 'classnames';

import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/Button/Button';
import Icon from '../../components/Icon/Icon';
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
  avatarUrl?: string;
  account: string | null | undefined;
  ensAddress: string | undefined;
  onConnectButtonClick: () => void;
  onDisconnectButtonClick: () => void;
  onMobileMenuButtonClick: () => void;
  className?: string;
}

const TopBar: FC<TopBarProps> = ({
  mobileMenuIsVisible,
  showDesktopConnectButton,
  showDesktopUserButton,
  avatarUrl,
  account,
  ensAddress,
  onConnectButtonClick,
  onDisconnectButtonClick,
  onMobileMenuButtonClick,
  className = '',
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const containerClassName = classNames('top-bar', {
    'top-bar--mobile-menu-is-visible': mobileMenuIsVisible,
  }, className);

  const handleDisconnectClick = () => {
    setIsPopupOpen(false);
    onDisconnectButtonClick();
  };

  const handleOutsideClick = (target: HTMLDivElement) => {
    if (target === popupRef.current
      || popupRef.current?.contains(target)
      || target === buttonRef.current
      || buttonRef.current?.contains(target)) { return; }
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener('mousedown', (event) => handleOutsideClick(event.target as HTMLDivElement));
    } else {
      document.removeEventListener('mousedown', (event) => handleOutsideClick(event.target as HTMLDivElement));
    }
  }, [isPopupOpen]);

  return (
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
        {showDesktopUserButton
          && (
            <div ref={buttonRef}>
              <Button
                text={truncateAddress(ensAddress || account || '')}
                className="top-bar__user-button"
                onClick={() => setIsPopupOpen(!isPopupOpen)}
              >
                {avatarUrl
                ? <Avatar avatarUrl={avatarUrl} className="top-bar__user-button-icon" />
                : <Icon name="logout" className="top-bar__user-button-icon" />}
                {truncateAddress(ensAddress || account || '')}
              </Button>
            </div>
          )}
      </div>
      {isPopupOpen && (
        <div className="top-bar__user-popup" ref={popupRef}>
          <UserPopup address={account || ''} ensAddress={ensAddress} onLogoutButtonClick={handleDisconnectClick} />
        </div>
      )}
    </div>
  );
};


export default TopBar;
