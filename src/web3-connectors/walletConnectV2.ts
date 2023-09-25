import { ChainIds } from '@airswap/constants';
import { initializeConnector } from '@web3-react/core';
import { WalletConnect } from '@web3-react/walletconnect-v2';

import { Connection, ConnectionType } from './connections';

const chains = Object.keys(ChainIds).map(Number).filter(Number);

export function buildWalletConnectConnector() {
  const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<WalletConnect>(
    (actions) => new WalletConnect({
      actions,
      options: {
        projectId: '0e8f5a3af4d45995d3aff35a1290c8d9',
        chains: [ChainIds.MAINNET, ChainIds.GOERLI],
        optionalChains: chains.filter((chain) => chain !== ChainIds.MAINNET),
        showQrModal: true,
      },
    }),
  );
  const walletConnectConnection: Connection = {
    connector: web3WalletConnect,
    hooks: web3WalletConnectHooks,
    type: ConnectionType.walletConnect,
  };
  return walletConnectConnection;
}
