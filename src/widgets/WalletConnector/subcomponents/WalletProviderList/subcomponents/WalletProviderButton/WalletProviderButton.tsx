import React, { FC } from 'react';

import Button from '../../../../../../components/Button/Button';
import { WalletProvider } from '../../../../../../web3-connectors/walletProviders';

import './WalletProviderButton.scss';

interface WalletProviderButtonProps {
  walletProvider: WalletProvider;
  onClick: (provider: WalletProvider) => void;
  className?: string;
}

const WalletProviderButton: FC<WalletProviderButtonProps> = ({ walletProvider, onClick, className = '' }) => {
  const handleClick = () => {
    onClick(walletProvider);
  };

  const buttonText = walletProvider.isInstalled ? walletProvider.name : `${walletProvider.name} (install)`;

  return (
    <Button
      text={buttonText}
      className={`wallet-provider-button ${className}`}
      onClick={handleClick}
    >
      <img
        alt={`${walletProvider.name} logo`}
        src={walletProvider.logo}
        className="wallet-provider-button__logo"
      />
      <span className="wallet-provider-button__name">
        {buttonText}
      </span>
    </Button>
  );
};

export default WalletProviderButton;
