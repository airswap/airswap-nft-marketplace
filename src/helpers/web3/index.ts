import { Web3Provider } from '@ethersproject/providers';

const cachedLibrary: Record<string, Web3Provider> = {};

export const getLibrary = (provider: any): Web3Provider => {
  if (!cachedLibrary[provider.chainId]) {
    cachedLibrary[provider.chainId] = new Web3Provider(provider);
    cachedLibrary[provider.chainId].pollingInterval = 12000;
  }
  return cachedLibrary[provider.chainId];
};
