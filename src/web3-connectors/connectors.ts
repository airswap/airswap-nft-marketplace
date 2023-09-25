import { Web3ReactHooks } from '@web3-react/core';
import type { MetaMask } from '@web3-react/metamask';
import type { WalletConnect } from '@web3-react/walletconnect-v2';

import { hooks as metaMaskHooks, metaMask } from './metaMask';
import { hooks as walletConnectHooks, walletConnect } from './walletConnect';

export type SupportedWalletConnectors = MetaMask | WalletConnect;

export const connectors: [MetaMask | WalletConnect, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
];
