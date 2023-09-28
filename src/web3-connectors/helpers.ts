import { AddEthereumChainParameter, Connector } from '@web3-react/types';

import { chainInfo } from './chainInfo';
import { ConnectionType, getConnection } from './connections';

const getIsBraveWallet = (): boolean => window.ethereum?.isBraveWallet ?? false;

export const getHasMetaMaskExtensionInstalled = (): boolean => (window.ethereum?.isMetaMask ?? false) && !getIsBraveWallet();

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
    chainName: info.nativeCurrency.name,
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
