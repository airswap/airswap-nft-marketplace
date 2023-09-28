import React, { FC, useEffect } from 'react';

import { Connector } from '@web3-react/types';

import IconButton from '../../compositions/IconButton/IconButton';
import { useAppDispatch } from '../../redux/hooks';
import { getLastProviderFromLocalStorage } from '../../redux/stores/web3/web3Api';
import { setConnectionType, setIsInitialized } from '../../redux/stores/web3/web3Slice';
import { ConnectionType, getConnection } from '../../web3-connectors/connections';
import { tryActivateConnector } from '../../web3-connectors/helpers';
import walletProviders, { WalletProvider } from '../../web3-connectors/walletProviders';
import WalletProviderList from './subcomponents/WalletProviderList/WalletProviderList';

import './WalletConnector.scss';

interface WalletConnectorProps {
  onCloseButtonClick: () => void;
  className?: string;
}

const WalletConnector: FC<WalletConnectorProps> = ({ onCloseButtonClick, className = '' }) => {
  const dispatch = useAppDispatch();

  const activateWallet = async (provider: WalletProvider) => {
    try {
      await tryActivateConnector(getConnection(provider.type).connector);
      dispatch(setConnectionType(provider.type));
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setIsInitialized(true));
    }
  };

  const activateWalletEagerly = async (connector: Connector, type: ConnectionType) => {
    try {
      if (connector.connectEagerly) {
        await connector.connectEagerly();
        dispatch(setConnectionType(type));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setIsInitialized(true));
    }
  };

  useEffect(() => {
    const type = getLastProviderFromLocalStorage();

    if (!type) {
      dispatch(setIsInitialized(true));

      return;
    }

    activateWalletEagerly(getConnection(type).connector, type);
  }, []);

  const handleWalletProviderButtonClick = (provider: WalletProvider): void => {
    if (!provider.isInstalled) {
      window.open(provider.url, '_blank');

      return;
    }

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
          walletProviders={walletProviders}
          onWalletProviderButtonClick={handleWalletProviderButtonClick}
          className="wallet-connector__wallet-providers-list"
        />
      </div>
    </div>
  );
};

export default WalletConnector;
