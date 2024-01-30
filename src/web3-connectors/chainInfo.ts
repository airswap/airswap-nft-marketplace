import { ChainIds } from '@airswap/utils';
import { AddEthereumChainParameter } from '@web3-react/types';

import nativeCurrency from '../constants/nativeCurrency';
import { rpcUrls } from '../constants/rpc';
import { SupportedChain } from '../constants/supportedChains';

interface ChainInfo extends Partial<AddEthereumChainParameter> {
  explorer: string;
  label: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  }
  rpcUrl: string;
}

export const chainInfo: Record<SupportedChain, ChainInfo> = {
  [ChainIds.MAINNET]: {
    explorer: 'https://etherscan.io/',
    label: 'Ethereum',
    nativeCurrency: nativeCurrency[ChainIds.MAINNET],
    rpcUrl: rpcUrls[ChainIds.MAINNET] as string,
  },
  [ChainIds.SEPOLIA]: {
    explorer: 'https://sepolia.etherscan.io/',
    label: 'Sepolia',
    nativeCurrency: nativeCurrency[ChainIds.SEPOLIA],
    rpcUrl: rpcUrls[ChainIds.SEPOLIA] as string,
  },
  [ChainIds.POLYGON]: {
    explorer: 'https://polygonscan.com/',
    label: 'Polygon',
    nativeCurrency: nativeCurrency[ChainIds.POLYGON],
    rpcUrl: rpcUrls[ChainIds.POLYGON] as string,
  },
  [ChainIds.MUMBAI]: {
    explorer: 'https://mumbai.polygonscan.com/',
    label: 'Mumbai',
    nativeCurrency: nativeCurrency[ChainIds.MUMBAI],
    rpcUrl: rpcUrls[ChainIds.MUMBAI] as string,
  },
};
