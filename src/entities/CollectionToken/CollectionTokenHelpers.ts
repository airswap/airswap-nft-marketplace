import { getCollectionTokenInfo } from '@airswap/metadata';
import { CollectionTokenInfo, FullOrder } from '@airswap/types';
import * as ethers from 'ethers';

export const getCollectionToken = async (library: ethers.providers.BaseProvider, address: string, tokenId: number): Promise<CollectionTokenInfo | undefined> => {
  let tokenInfo: CollectionTokenInfo;

  try {
    tokenInfo = await getCollectionTokenInfo(library, address, tokenId.toString());
  } catch (e) {
    console.error(new Error(`Unable to fetch data for ${address} with id ${tokenId}`));

    return undefined;
  }

  return tokenInfo;
};

export const isCollectionTokenInfo = (resource: any): resource is CollectionTokenInfo => (
  resource
    && typeof resource.chainId === 'number'
    && typeof resource.kind === 'string'
    && typeof resource.address === 'string'
    && typeof resource.id === 'number'
    && typeof resource.uri === 'string'
    && resource.attributes && Array.isArray(resource.attributes)
);

export const getCollectionTokensInfoFromOrders = async (library: ethers.providers.BaseProvider, orders: FullOrder[]): Promise<CollectionTokenInfo[]> => {
  const results = await Promise.all(orders.map(order => getCollectionToken(library, order.signer.token, +order.signer.id)));

  return results.filter(isCollectionTokenInfo) as CollectionTokenInfo[];
};
