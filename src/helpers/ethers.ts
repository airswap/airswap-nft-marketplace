import { Web3Provider } from '@ethersproject/providers';

const cachedLibrary: Record<string, Web3Provider> = {};

export const setLibrary = (provider: any): Web3Provider => {
  const chainId = parseInt(provider.chainId, 16);

  if (!cachedLibrary[chainId]) {
    cachedLibrary[chainId] = new Web3Provider(provider);
    cachedLibrary[chainId].pollingInterval = 12000;
  }
  return cachedLibrary[chainId];
};

export const getLibrary = (chainId: number): Web3Provider => cachedLibrary[chainId];
