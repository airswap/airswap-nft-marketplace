import { ChainIds } from '@airswap/constants';
import { AddEthereumChainParameter } from '@web3-react/types';

import nativeCurrency from '../constants/nativeCurrency';
import { rpcUrls } from '../constants/rpc';

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

export const chainInfo: { [key: string]: ChainInfo } = {
  [ChainIds.MAINNET]: {
    explorer: 'https://etherscan.io/',
    label: 'Ethereum',
    nativeCurrency: nativeCurrency[ChainIds.MAINNET],
    rpcUrl: rpcUrls[ChainIds.MAINNET] as string,
  },
  [ChainIds.GOERLI]: {
    explorer: 'https://goerli.etherscan.io/',
    label: 'Goerli',
    nativeCurrency: nativeCurrency[ChainIds.GOERLI],
    rpcUrl: rpcUrls[ChainIds.GOERLI] as string,
  },
};
