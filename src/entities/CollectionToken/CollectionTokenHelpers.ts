import { getCollectionTokenInfo } from '@airswap/metadata';
import { CollectionTokenInfo } from '@airswap/types';
import * as ethers from 'ethers';

export const getCollectionToken = async (library: ethers.providers.BaseProvider, address: string, tokenId: number): Promise<CollectionTokenInfo | undefined> => {
  let tokenInfo: CollectionTokenInfo;

  try {
    tokenInfo = await getCollectionTokenInfo(library, address, tokenId.toString());
  } catch (e) {
    console.error(new Error(`Unable to fetch data for ${address} with id ${tokenId}`));

    return undefined;
  }

  if (!tokenInfo) {
    console.error(new Error(`Unable to parse data for ${address} with id ${tokenId}`));
  }

  return tokenInfo;
};
