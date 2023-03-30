import { getTokenFromContract } from '@airswap/metadata';
import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { transformNFTTokenToCollectionToken } from '../../../entities/CollectionToken/CollectionTokenTransformers';

interface fetchNFTMetadataParams {
  library: Web3Provider,
  collectionToken: string,
  tokenIds: number[],
}

export const fetchCollectionTokens = createAsyncThunk<(
CollectionToken | undefined)[], fetchNFTMetadataParams>(
  'collection/fetchNFTMetadata',
  async ({ library, collectionToken, tokenIds }) => {
    const dataPromises = tokenIds.map(async (tokenId) => {
      let tokenInfo: TokenInfo;

      try {
        tokenInfo = await getTokenFromContract(library, collectionToken, tokenId.toString());
      } catch (e) {
        console.error(new Error(`Unable to fetch data for ${collectionToken} with id ${tokenId}`));

        return undefined;
      }

      const token = transformNFTTokenToCollectionToken(tokenInfo, tokenId, '0.154000000000000000');

      if (!token) {
        console.error(new Error(`Unable to parse data for ${collectionToken} with id ${tokenId}`));
      }

      return token;
    });

    return Promise.all(dataPromises);
  },
  );
