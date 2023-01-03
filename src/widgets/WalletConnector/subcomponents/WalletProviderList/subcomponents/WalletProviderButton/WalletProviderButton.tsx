import React, { FC } from 'react';

import Button from '../../../../../../components/Button/Button';
import { WalletProvider } from '../../../../../../constants/supportedWalletProviders';

interface WalletProviderButtonProps {
  walletProvider: WalletProvider;
  className?: string;
}

const WalletProviderButton: FC<WalletProviderButtonProps> = ({ walletProvider, className = '' }) => (
  <Button
    text={walletProvider.name}
    className={`wallet-provider-button ${className}`}
  >
    <img
      alt={`${walletProvider.name} logo`}
      src={walletProvider.url}
      className="wallet-provider-button__logo"
    />
    <span className="wallet-provider-button__name">
      {walletProvider.name}
    </span>
  </Button>
);

export default WalletProviderButton;
