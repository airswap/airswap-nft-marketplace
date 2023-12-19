import { Network } from 'alchemy-sdk';

export const getAlchemyChain = (chainId: number): Network => {
  switch (chainId) {
    case 1:
      return Network.ETH_MAINNET;
    case 5:
      return Network.ETH_GOERLI;
    default:
      throw new Error(`Alchemy does not support chainId ${chainId}`);
  }
};
