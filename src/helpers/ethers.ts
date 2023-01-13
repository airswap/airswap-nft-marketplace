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

export const startsWithIPFS: (str: string) => boolean = (str: string) => str.startsWith('ipfs://');
export const ipfsToUrl: (string: string) => string = (ipfsAddress) => `${process.env.REACT_APP_IPFS_GATEWAY_URL}${ipfsAddress.split('ipfs://')[1]}`;
