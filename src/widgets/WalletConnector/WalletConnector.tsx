import React, { FC } from 'react';

import SUPPORTED_WALLET_PROVIDERS from '../../constants/supportedWalletProviders';
import WalletProviderList from './subcomponents/WalletProviderList/WalletProviderList';

interface WalletConnectorProps {
  afterProviderSelect: () => void;
}

const WalletConnector: FC<WalletConnectorProps> = () => (
  <div className="wallet-connector">
    <WalletProviderList walletProviders={SUPPORTED_WALLET_PROVIDERS} />
  </div>
);

export default WalletConnector;
