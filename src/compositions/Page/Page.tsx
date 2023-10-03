import React, { FC, ReactNode, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import Button from '../../components/Button/Button';
import useEnsAddress from '../../hooks/useEnsAddress';
import useToggle from '../../hooks/useToggle';
import { useAppSelector } from '../../redux/hooks';
import { clearLastProvider } from '../../redux/stores/web3/web3Api';
import { getConnection } from '../../web3-connectors/connections';
import { tryDeactivateConnector } from '../../web3-connectors/helpers';
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
  const {
    isActive,
    account,
    chainId,
  } = useWeb3React<Web3Provider>();
  const ensAddress = useEnsAddress(account || '');
  const { config } = useAppSelector((state) => state);
  const { isInitialized, connectionType } = useAppSelector((state) => state.web3);
  const { avatarUrl } = useAppSelector((state) => state.user);

  const chainIdIsCorrect = !!chainId && chainId === config.chainId;

  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState(false);
  const [showWalletConnector, toggleShowWalletConnector] = useToggle(!isActive);

  const pageClassName = classNames('page', {
    'page--show-wallet-connector': showWalletConnector && isInitialized && !isActive,
  }, className);

  const handleIconButtonClick = (): void => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  };

  const handleDisconnectButtonClick = (): void => {
    if (!connectionType) {
      return;
    }

    tryDeactivateConnector(getConnection(connectionType).connector);
    clearLastProvider();
  };

  return (
    <div className={pageClassName}>
      <Helmet>
        <title>{config.collectionName}</title>
      </Helmet>
      <TopBar
        listButtonIsDisabled={!chainIdIsCorrect || !account}
        mobileMenuIsVisible={mobileMenuIsVisible}
        showDesktopConnectButton={isInitialized && !isActive}
        showDesktopUserButton={isInitialized && isActive}
        userWalletButtonIsDisabled={!chainIdIsCorrect}
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
        onNavLinkClick={handleIconButtonClick}
        className="page__mobile-menu"
      />
      <WalletConnector
        onCloseButtonClick={toggleShowWalletConnector}
        className="page__wallet-connector"
      />

      <div className={`page__content ${contentClassName}`}>
        {children}

        {(!isActive && !showWalletConnector) && (
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
