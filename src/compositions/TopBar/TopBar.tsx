import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import Avatar from '../../components/Avatar/Avatar';
import Button from '../../components/Button/Button';
import { truncateAddress } from '../../helpers/stringUtils';
import { AppRoutes } from '../../routes';
import IconButton from '../IconButton/IconButton';
import IconNavLink from '../IconNavLink/IconNavLink';
import UserPopup from '../UserPopup/UserPopup';
import DesktopNav from './subcomponents/DesktopNav/DesktopNav';

import './TopBar.scss';

interface TopBarProps {
  listButtonIsDisabled: boolean;
  mobileMenuIsVisible: boolean;
  showDesktopConnectButton: boolean;
  showDesktopUserButton: boolean;
  userWalletButtonIsDisabled: boolean;
  avatarUrl?: string;
  account: string | null | undefined;
  ensAddress: string | undefined;
  onConnectButtonClick: () => void;
  onDisconnectButtonClick: () => void;
  onMobileMenuButtonClick: () => void;
  className?: string;
}

const TopBar: FC<TopBarProps> = ({
  listButtonIsDisabled,
  mobileMenuIsVisible,
  showDesktopConnectButton,
  showDesktopUserButton,
  userWalletButtonIsDisabled,
  avatarUrl,
  account,
  ensAddress,
  onConnectButtonClick,
  onDisconnectButtonClick,
  onMobileMenuButtonClick,
  className = '',
}) => {
  const userPopupRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const containerClassName = classNames('top-bar', {
    'top-bar--mobile-menu-is-visible': mobileMenuIsVisible,
  }, className);

  const handleDisconnectClick = () => {
    setIsPopupOpen(false);
    onDisconnectButtonClick();
  };

  const handleDocumentClick = (e: MouseEvent) => {
    if (e.target instanceof Node && (userPopupRef.current?.contains(e.target))) {
      return;
    }

    if (e.target === userButtonRef.current) {
      return;
    }

    setIsPopupOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);

    return () => document.removeEventListener('mousedown', handleDocumentClick);
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
          aria-disabled={listButtonIsDisabled}
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
            <Button
              disabled={userWalletButtonIsDisabled}
              ref={userButtonRef}
              text={truncateAddress(ensAddress || account || '')}
              onClick={() => setIsPopupOpen(!isPopupOpen)}
              className="top-bar__user-button"
            >
              <Avatar avatarUrl={avatarUrl} className="top-bar__user-button-icon" />
              {truncateAddress(ensAddress || account || '')}
            </Button>
          )}
      </div>
      {isPopupOpen && (
        <UserPopup
          address={account || undefined}
          ensAddress={ensAddress}
          ref={userPopupRef}
          onLogoutButtonClick={handleDisconnectClick}
          className="top-bar__user-popup"
        />
      )}
    </div>
  );
};


export default TopBar;
