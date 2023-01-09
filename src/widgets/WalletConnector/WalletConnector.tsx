import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import IconButton from '../../compositions/IconButton/IconButton';
import SUPPORTED_WALLET_PROVIDERS, { WalletProvider } from '../../constants/supportedWalletProviders';
import WalletProviderList from './subcomponents/WalletProviderList/WalletProviderList';

import './WalletConnector.scss';

interface WalletConnectorProps {
  afterProviderSelect?: () => void;
  className?: string;
}

const WalletConnector: FC<WalletConnectorProps> = ({ afterProviderSelect, className = '' }) => {
  const { activate } = useWeb3React<Web3Provider>();

  const handleWalletProviderButtonClick = (provider: WalletProvider): void => {
    activate(provider.getConnector());

    if (afterProviderSelect) {
      afterProviderSelect();
    }
  };

  return (
    <div className={`wallet-connector ${className}`}>
      <div className="wallet-connector__wrapper">
        <div className="wallet-connector__header">
          <h1 className="wallet-connector__title">Select wallet</h1>
          <IconButton
            hideLabel
            icon="close"
            text="Close"
            className="wallet-connector__close-button"
          />
        </div>
        <WalletProviderList
          walletProviders={SUPPORTED_WALLET_PROVIDERS}
          onWalletProviderButtonClick={handleWalletProviderButtonClick}
          className="wallet-connector__wallet-providers-list"
        />
      </div>
    </div>
  );
};

export default WalletConnector;
