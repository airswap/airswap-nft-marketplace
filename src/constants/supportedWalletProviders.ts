// import { initializeConnector } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';

import { metaMask } from '../web3-connectors/metaMask';
import { SupportedWalletConnectors } from './web3-connectors';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

declare let window: any;

export type WalletProvider = {
  name: string;
  logo: string;
  isInstalled: boolean;
  url: string;
  connector: SupportedWalletConnectors;
};

// const cachedConnectors: Record<string, AbstractConnector> = {};

const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  {
    name: 'MetaMask',
    logo: 'logos/metamask.svg',
    isInstalled: typeof window.ethereum !== 'undefined',
    url: 'https://metamask.io/',
    connector: metaMask,
  },
  // {
  //   name: 'WalletConnect',
  //   logo: 'logos/walletconnect.svg',
  //   isInstalled: true,
  //   url: 'https://walletconnect.com/',
  //   getConnector: () => {
  //     if (!cachedConnectors.WalletConnect) {
  //       const [walletConnectV2] = initializeConnector<WalletConnectV2>(
  //         actions => new WalletConnectV2({
  //           actions,
  //           options: {
  //             projectId: 'walletConnectProjectId',
  //             chains: [1],
  //             optionalChains: [5],
  //             showQrModal: true,
  //           },
  //         }),
  //       );
  //
  //       // @ts-ignore
  //       cachedConnectors.WalletConnect = walletConnectV2;
  //     }
  //     return cachedConnectors.WalletConnect;
  //   },
  // },
];

export default SUPPORTED_WALLET_PROVIDERS;

export { AbstractConnector };
