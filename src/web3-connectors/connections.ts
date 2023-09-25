import { Web3ReactHooks } from '@web3-react/core';
import { AddEthereumChainParameter, Connector } from '@web3-react/types';

import { chainInfo } from './chainInfo';
import { buildInjectedConnector } from './injected';
import { buildWalletConnectConnector } from './walletConnectV2';

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

export enum ConnectionType {
  injected = 'injected',
  walletConnect = 'walletConnect',
}

export const onConnectionError = (error: Error) => {
  console.debug(`web3-react error: ${error}`);
};

export const prioritizedConnectors: { [key in ConnectionType]: Connection } = {
  [ConnectionType.injected]: buildInjectedConnector(),
  [ConnectionType.walletConnect]: buildWalletConnectConnector(),
};

export function getConnection(c: Connector | ConnectionType): Connection {
  if (c instanceof Connector) {
    const connection = Object.values(prioritizedConnectors).find(connector => connector.connector === c);
    if (!connection) {
      throw Error('Unsupported Connector');
    }
    return connection;
  }

  if (c === ConnectionType.walletConnect) {
    return prioritizedConnectors[ConnectionType.walletConnect];
  }

  return prioritizedConnectors[ConnectionType.injected];
}

export const switchNetwork = async (chainId: number, connectionType: ConnectionType | null): Promise<void> => {
  if (!connectionType) {
    return;
  }

  const { connector } = getConnection(connectionType);

  if (connectionType === ConnectionType.walletConnect) {
    await connector.activate(chainId);

    return;
  }

  const info = chainInfo[chainId];
  const addChainParameter: AddEthereumChainParameter = {
    chainId,
    chainName: info.label,
    rpcUrls: [info.rpcUrl],
    nativeCurrency: info.nativeCurrency,
    blockExplorerUrls: [info.explorer],
  };
  await connector.activate(addChainParameter);
};

export const tryActivateConnector = async (connector: Connector): Promise<ConnectionType | undefined> => {
  await connector.activate();

  return getConnection(connector).type;
};

export const tryDeactivateConnector = async (connector: Connector): Promise<null | undefined> => {
  await connector.deactivate?.();
  await connector.resetState();

  return null;
};
