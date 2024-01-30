import { ChainIds } from '@airswap/utils';
import { Network } from 'alchemy-sdk';

import { SupportedChain } from '../constants/supportedChains';

const chainIdAlchemyChainRecord: Record<SupportedChain, Network> = {
  [ChainIds.MAINNET]: Network.ETH_MAINNET,
  [ChainIds.POLYGON]: Network.MATIC_MAINNET,
  [ChainIds.MUMBAI]: Network.MATIC_MUMBAI,
  [ChainIds.SEPOLIA]: Network.ETH_SEPOLIA,
};

export const getAlchemyChain = (chainId: number): Network => {
  const alchemyChain = chainIdAlchemyChainRecord[chainId as SupportedChain];

  if (!alchemyChain) {
    throw new Error(`Alchemy does not support chainId ${chainId}`);
  }

  return alchemyChain;
};
