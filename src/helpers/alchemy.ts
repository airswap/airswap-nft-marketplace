import { ChainIds } from '@airswap/constants';
import { Network } from 'alchemy-sdk';

const chainIdAlchemyChainRecord: Record<number, Network> = {
  [ChainIds.MAINNET]: Network.ETH_MAINNET,
  [ChainIds.GOERLI]: Network.ETH_GOERLI,
  [ChainIds.POLYGON]: Network.MATIC_MAINNET,
  [ChainIds.MUMBAI]: Network.MATIC_MUMBAI,
  [ChainIds.SEPOLIA]: Network.ETH_SEPOLIA,
};

export const getAlchemyChain = (chainId: number): Network => {
  const alchemyChain = chainIdAlchemyChainRecord[chainId];

  if (!alchemyChain) {
    throw new Error(`Alchemy does not support chainId ${chainId}`);
  }

  return alchemyChain;
};
