import React, { FC } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import SUPPORTED_WALLET_PROVIDERS, { WalletProvider } from '../../constants/supportedWalletProviders';
import WalletProviderList from './subcomponents/WalletProviderList/WalletProviderList';

interface WalletConnectorProps {
  afterProviderSelect?: () => void;
}

const WalletConnector: FC<WalletConnectorProps> = ({ afterProviderSelect }) => {
  const { activate } = useWeb3React<Web3Provider>();

  const handleWalletProviderButtonClick = (provider: WalletProvider): void => {
    activate(provider.getConnector());

    if (afterProviderSelect) {
      afterProviderSelect();
    }
  };

  return (
    <div className="wallet-connector">
      <WalletProviderList
        walletProviders={SUPPORTED_WALLET_PROVIDERS}
        onWalletProviderButtonClick={handleWalletProviderButtonClick}
      />
    </div>
  );
};

export default WalletConnector;
