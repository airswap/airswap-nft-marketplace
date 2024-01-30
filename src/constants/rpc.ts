import { ChainIds } from '@airswap/utils';

import { SupportedChain } from './supportedChains';

export const rpcUrls: Record<SupportedChain, string | undefined> = {
  [ChainIds.MAINNET]: process.env.REACT_APP_RPC_URL_1,
  [ChainIds.POLYGON]: process.env.REACT_APP_RPC_URL_137,
  [ChainIds.MUMBAI]: process.env.REACT_APP_RPC_URL_80001,
  [ChainIds.SEPOLIA]: process.env.REACT_APP_RPC_URL_11155111,
};
