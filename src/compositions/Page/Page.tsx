import React, { FC, ReactNode, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import Button from '../../components/Button/Button';
import useToggle from '../../hooks/useToggle';
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
  const { active } = useWeb3React<Web3Provider>();

  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState<boolean>(false);
  const [showWalletConnector, toggleShowWalletConnector] = useToggle(!active);

  const handleIconButtonClick = (): void => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  };

  return (
    <div className={`page ${className}`}>
      <TopBar
        mobileMenuIsVisible={mobileMenuIsVisible}
        showDesktopConnectButton={!active}
        onConnectButtonClick={toggleShowWalletConnector}
        onMobileMenuButtonClick={handleIconButtonClick}
        className="page__top-bar"
      />

      <MobileMenu
        isHidden={!mobileMenuIsVisible}
        onNavLinkClick={handleIconButtonClick}
        className="page__mobile-menu"
      />
      {(!active && showWalletConnector) && (
        <WalletConnector
          className="page__wallet-connector"
          onCloseButtonClick={toggleShowWalletConnector}
        />
      )}

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
