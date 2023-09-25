import { ChainIds } from '@airswap/constants';
import { AddEthereumChainParameter } from '@web3-react/types';

import { rpcUrls } from '../constants/rpc';

interface ChainInfo extends Partial<AddEthereumChainParameter> {
  explorer: string
  label: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: 18
  }
  rpcUrl: string
}

export const chainInfo: { [key: string]: ChainInfo } = {
  [ChainIds.MAINNET]: {
    explorer: 'https://etherscan.io/',
    label: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: rpcUrls[ChainIds.MAINNET] as string,
  },
  [ChainIds.GOERLI]: {
    explorer: 'https://goerli.etherscan.io/',
    label: 'Goerli',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrl: rpcUrls[ChainIds.GOERLI] as string,
  },
};
