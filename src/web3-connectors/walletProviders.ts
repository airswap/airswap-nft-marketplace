import { ConnectionType } from './connections';
import { SupportedWalletConnectors } from './connectors';
import { getHasMetaMaskExtensionInstalled } from './helpers';
import { metaMask } from './metaMask';
import { walletConnect } from './walletConnect';

export type WalletProvider = {
  name: string;
  logo: string;
  isInstalled: boolean;
  url: string;
  type: ConnectionType;
  connector: SupportedWalletConnectors;
};

const SUPPORTED_WALLET_PROVIDERS: WalletProvider[] = [
  {
    name: 'MetaMask',
    logo: 'logos/metamask.svg',
    isInstalled: getHasMetaMaskExtensionInstalled(),
    url: 'https://metamask.io/',
    type: ConnectionType.injected,
    connector: metaMask,
  },
  {
    name: 'WalletConnect',
    logo: 'logos/walletconnect.svg',
    isInstalled: true,
    url: 'https://walletconnect.com/',
    type: ConnectionType.walletConnect,
    connector: walletConnect,
  },
];

export default SUPPORTED_WALLET_PROVIDERS;
