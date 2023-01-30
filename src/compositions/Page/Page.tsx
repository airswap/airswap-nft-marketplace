import React, { FC, ReactNode, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';

import Button from '../../components/Button/Button';
import useEnsAddress from '../../hooks/useEnsAddress';
import useToggle from '../../hooks/useToggle';
import { useAppSelector } from '../../redux/hooks';
import { clearLastProvider } from '../../redux/stores/web3/web3Api';
import WalletConnector from '../../widgets/WalletConnector/WalletConnector';
import MobileMenu from '../MobileMenu/MobileMenu';
import TopBar from '../TopBar/TopBar';

import './Page.scss';

interface PageProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

const Page: FC<PageProps> = ({ className = '', contentClassName = '', children }) => {
  const { active, account, deactivate } = useWeb3React<Web3Provider>();
  const ensAddress = useEnsAddress(account || '');
  const { isInitialized } = useAppSelector((state) => state.web3);
  const { avatarUrl } = useAppSelector((state) => state.user);

  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState<boolean>(false);
  const [showWalletConnector, toggleShowWalletConnector] = useToggle(!active);

  const pageClassName = classNames('page', {
    'page--show-wallet-connector': showWalletConnector && isInitialized && !active,
  }, className);

  const handleIconButtonClick = (): void => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  };

  const handleDisconnectButtonClick = (): void => {
    deactivate();
    // TODO: Make proper action for this.
    clearLastProvider();
  };

  return (
    <div className={pageClassName}>
      <TopBar
        mobileMenuIsVisible={mobileMenuIsVisible}
        showDesktopConnectButton={isInitialized && !active}
        showDesktopUserButton={isInitialized && active}
        avatarUrl={avatarUrl}
        account={account}
        ensAddress={ensAddress}
        onConnectButtonClick={toggleShowWalletConnector}
        onDisconnectButtonClick={handleDisconnectButtonClick}
        onMobileMenuButtonClick={handleIconButtonClick}
        className="page__top-bar"
      />
      <MobileMenu
        isHidden={!mobileMenuIsVisible}
        avatarUrl={avatarUrl}
        address={account || undefined}
        onLogoutButtonClick={handleDisconnectButtonClick}
        onNavLinkClick={handleIconButtonClick}
        className="page__mobile-menu"
      />
      <WalletConnector
        onCloseButtonClick={toggleShowWalletConnector}
        className="page__wallet-connector"
      />

      <div className={`page__content ${contentClassName}`}>
        {children}

        {(!active && !showWalletConnector) && (
          <Button
            text="Connect wallet"
            onClick={toggleShowWalletConnector}
            className="page__connect-wallet-button"
          />
        )}
      </div>
    </div>
  );
};

export default Page;
