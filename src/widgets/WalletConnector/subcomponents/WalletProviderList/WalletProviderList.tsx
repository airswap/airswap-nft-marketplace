import React, { FC } from 'react';

import { WalletProvider } from '../../../../constants/supportedWalletProviders';
import WalletProviderButton from './subcomponents/WalletProviderButton/WalletProviderButton';

import './WalletProviderList.scss';

interface WalletProviderListProps {
  walletProviders: WalletProvider[];
  onWalletProviderButtonClick: (provider: WalletProvider) => void;
  className?: string;
}

const WalletProviderList: FC<WalletProviderListProps> = ({ walletProviders, onWalletProviderButtonClick, className = '' }) => (
  <div className={`wallet-provider-list ${className}`}>
    {walletProviders.map((provider) => (
      <WalletProviderButton
        key={provider.name}
        walletProvider={provider}
        onClick={onWalletProviderButtonClick}
        className="wallet-provider-list__button"
      />
    ))}
  </div>
);

export default WalletProviderList;
