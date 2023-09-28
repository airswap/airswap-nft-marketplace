import { ConnectionType } from './connections';
import { getHasMetaMaskExtensionInstalled } from './helpers';

export type WalletProvider = {
  name: string;
  logo: string;
  isInstalled: boolean;
  url: string;
  type: ConnectionType;
};

const walletConnectProjectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;

const walletProviders: WalletProvider[] = [
  {
    name: 'MetaMask',
    logo: 'logos/metamask.svg',
    isInstalled: getHasMetaMaskExtensionInstalled(),
    url: 'https://metamask.io/',
    type: ConnectionType.injected,
  },
  ...(walletConnectProjectId ? [
    {
      name: 'WalletConnect',
      logo: 'logos/walletconnect.svg',
      isInstalled: true,
      url: 'https://walletconnect.com/',
      type: ConnectionType.walletConnect,
    },
  ] : []),
];

export default walletProviders;
