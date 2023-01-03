import React, { FC } from 'react';

import { WalletProvider } from '../../../../constants/supportedWalletProviders';
import WalletProviderButton from './subcomponents/WalletProviderButton/WalletProviderButton';

import './WalletProviderList.scss';

interface WalletProviderListProps {
  walletProviders: WalletProvider[];
  className?: string;
}

const WalletProviderList: FC<WalletProviderListProps> = ({ walletProviders, className = '' }) => (
  <div className={`wallet-provider-list ${className}`}>
    {walletProviders.map((provider) => (
      <WalletProviderButton
        key={provider.name}
        walletProvider={provider}
        className="wallet-provider-list__button"
      />
    ))}
  </div>
);

export default WalletProviderList;
