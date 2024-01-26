import { ChainIds } from '@airswap/constants';

export const rpcUrls: { [chainId: number]: string | undefined } = {
  [ChainIds.MAINNET]: process.env.REACT_APP_RPC_URL_1,
  [ChainIds.GOERLI]: process.env.REACT_APP_RPC_URL_5,
  [ChainIds.POLYGON]: process.env.REACT_APP_RPC_URL_137,
  [ChainIds.MUMBAI]: process.env.REACT_APP_RPC_URL_80001,
  [ChainIds.SEPOLIA]: process.env.REACT_APP_RPC_URL_11155111,
};
