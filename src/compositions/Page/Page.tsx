import React, { FC, PropsWithChildren, useState } from 'react';

import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import Button from '../../components/Button/Button';
import WalletConnector from '../../widgets/WalletConnector/WalletConnector';
import MobileMenu from '../MobileMenu/MobileMenu';
import TopBar from '../TopBar/TopBar';

import './Page.scss';

interface PageProps {
  isActive: boolean;
  listButtonIsDisabled: boolean;
  showConnectModal: boolean;
  showDesktopConnectButton: boolean;
  showDesktopUserButton: boolean;
  showDisableDemoAccountButton: boolean;
  showMobileMenuButton: boolean;
  userWalletButtonIsDisabled: boolean;
  account?: string;
  avatarUrl?: string;
  collectionName: string;
  ensAddress?: string;
  onConnectButtonClick: () => void;
  onCloseWalletConnectorButtonClick: () => void;
  onDisableDemoAccountButtonClick: () => void;
  onDisconnectButtonClick: () => void;
  className?: string;
  contentClassName?: string;
}

const Page: FC<PropsWithChildren<PageProps>> = ({
  isActive,
  listButtonIsDisabled,
  onCloseWalletConnectorButtonClick,
  showConnectModal,
  showDesktopUserButton,
  showDesktopConnectButton,
  showDisableDemoAccountButton,
  showMobileMenuButton,
  userWalletButtonIsDisabled,
  account,
  avatarUrl,
  collectionName,
  ensAddress,
  onConnectButtonClick,
  onDisableDemoAccountButtonClick,
  onDisconnectButtonClick,
  className = '',
  contentClassName = '',
  children,
}) => {
  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState(false);

  const pageClassName = classNames('page', {
    'page--show-wallet-connector': showConnectModal,
  }, className);

  const handleIconButtonClick = (): void => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  };

  return (
    <div className={pageClassName}>
      <Helmet>
        <title>{collectionName}</title>
      </Helmet>

      <TopBar
        listButtonIsDisabled={listButtonIsDisabled}
        mobileMenuIsVisible={mobileMenuIsVisible}
        showDesktopConnectButton={showDesktopConnectButton}
        showDesktopUserButton={showDesktopUserButton}
        showDisableDemoAccountButton={showDisableDemoAccountButton}
        showMobileMenuButton={showMobileMenuButton}
        userWalletButtonIsDisabled={userWalletButtonIsDisabled}
        avatarUrl={avatarUrl}
        account={account}
        ensAddress={ensAddress}
        onConnectButtonClick={onConnectButtonClick}
        onDisableDemoAccountButtonClick={onDisableDemoAccountButtonClick}
        onDisconnectButtonClick={onDisconnectButtonClick}
        onMobileMenuButtonClick={handleIconButtonClick}
        className="page__top-bar"
      />

      {(account && isActive) && (
        <MobileMenu
          isHidden={!mobileMenuIsVisible}
          showDisableDemoAccountButton={showDisableDemoAccountButton}
          avatarUrl={avatarUrl}
          address={account}
          onDisableDemoAccountButtonClick={onDisableDemoAccountButtonClick}
          onNavLinkClick={handleIconButtonClick}
          onLogoutButtonClick={onDisconnectButtonClick}
          className="page__mobile-menu"
        />
      )}

      <WalletConnector
        onCloseButtonClick={onCloseWalletConnectorButtonClick}
        className="page__wallet-connector"
      />

      <div className={`page__content ${contentClassName}`}>
        {children}

        {(!isActive && !showConnectModal) && (
          <Button
            text="Connect wallet"
            onClick={onConnectButtonClick}
            className="page__connect-wallet-button"
          />
        )}
      </div>
    </div>
  );
};

export default Page;
