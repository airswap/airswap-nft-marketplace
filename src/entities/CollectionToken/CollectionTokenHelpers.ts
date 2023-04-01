import { getTokenFromContract } from '@airswap/metadata';
import { TokenInfo } from '@airswap/types';
import * as ethers from 'ethers';

import { CollectionToken } from './CollectionToken';
import { transformNFTTokenToCollectionToken } from './CollectionTokenTransformers';

export const getCollectionToken = async (library: ethers.providers.BaseProvider, address: string, tokenId: number): Promise<CollectionToken | undefined> => {
  let tokenInfo: TokenInfo;

  try {
    tokenInfo = await getTokenFromContract(library, address, tokenId.toString());
  } catch (e) {
    console.error(new Error(`Unable to fetch data for ${address} with id ${tokenId}`));

    return undefined;
  }

  const token = transformNFTTokenToCollectionToken(tokenInfo, tokenId);

  if (!token) {
    console.error(new Error(`Unable to parse data for ${address} with id ${tokenId}`));
  }

  return token;
};
