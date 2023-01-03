import React, { FC } from 'react';

import Button from '../../../../../../components/Button/Button';
import { WalletProvider } from '../../../../../../constants/supportedWalletProviders';

import './WalletProviderButton.scss';

interface WalletProviderButtonProps {
  walletProvider: WalletProvider;
  className?: string;
}

const WalletProviderButton: FC<WalletProviderButtonProps> = ({ walletProvider, className = '' }) => {
  const handleClick = (event: WalletProvider) => {
    console.log(event.getConnector());
    event.getConnector();
  };

  return (
    <Button
      text={walletProvider.name}
      className={`wallet-provider-button ${className}`}
      onClick={() => handleClick(walletProvider)}
    >
      <img
        alt={`${walletProvider.name} logo`}
        src={walletProvider.logo}
        className="wallet-provider-button__logo"
      />
      <span className="wallet-provider-button__name">
        {walletProvider.name}
      </span>
    </Button>
  );
};

export default WalletProviderButton;
