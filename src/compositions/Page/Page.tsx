import React, { FC, ReactNode, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';

import Button from '../../components/Button/Button';
import useToggle from '../../hooks/useToggle';
import { useAppSelector } from '../../redux/hooks';
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
  const { isInitialized } = useAppSelector((state) => state.web3);

  const [mobileMenuIsVisible, setMobileMenuIsVisible] = useState<boolean>(false);
  const [showWalletConnector, toggleShowWalletConnector] = useToggle(!active);

  const pageClassName = classNames('page', {
    'page--show-wallet-connector': showWalletConnector && isInitialized && !active,
  }, className);

  const handleIconButtonClick = (): void => {
    setMobileMenuIsVisible(!mobileMenuIsVisible);
  };

  return (
    <div className={pageClassName}>
      <TopBar
        mobileMenuIsVisible={mobileMenuIsVisible}
        showDesktopConnectButton={isInitialized && !active}
        onConnectButtonClick={toggleShowWalletConnector}
        onMobileMenuButtonClick={handleIconButtonClick}
        className="page__top-bar"
      />

      <MobileMenu
        isHidden={!mobileMenuIsVisible}
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
