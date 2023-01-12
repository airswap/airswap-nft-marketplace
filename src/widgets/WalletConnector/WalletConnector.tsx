import React, { FC, useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import IconButton from '../../compositions/IconButton/IconButton';
import SUPPORTED_WALLET_PROVIDERS, { WalletProvider } from '../../constants/supportedWalletProviders';
import { useAppDispatch } from '../../redux/hooks';
import { getLastProviderFromLocalStorage } from '../../redux/stores/web3/web3Api';
import { setIsInitialized, setWalletName } from '../../redux/stores/web3/web3Slice';
import WalletProviderList from './subcomponents/WalletProviderList/WalletProviderList';

import './WalletConnector.scss';

interface WalletConnectorProps {
  onCloseButtonClick: () => void;
  className?: string;
}

const WalletConnector: FC<WalletConnectorProps> = ({ onCloseButtonClick, className = '' }) => {
  const dispatch = useAppDispatch();

  const { activate } = useWeb3React<Web3Provider>();

  const activateWallet = async (provider: WalletProvider) => {
    dispatch(setWalletName(provider.name));
    await activate(provider.getConnector());
    dispatch(setIsInitialized(true));
  };

  useEffect(() => {
    const provider = getLastProviderFromLocalStorage();
    if (provider) {
      activateWallet(provider);
    } else {
      dispatch(setIsInitialized(true));
    }
  }, []);

  const handleWalletProviderButtonClick = (provider: WalletProvider): void => {
    activateWallet(provider);
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
            onClick={onCloseButtonClick}
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
