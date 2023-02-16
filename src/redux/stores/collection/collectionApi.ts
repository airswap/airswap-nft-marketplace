import { getTokenFromContract } from '@airswap/metadata';
import { TokenInfo } from '@airswap/typescript';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { transformNFTTokenToCollectionToken } from '../../../entities/CollectionToken/CollectionTokenTransformers';

interface fetchNFTMetadataParams {
  library: Web3Provider,
  collectionToken: string,
  startIndex: number,
}

export const fetchCollectionTokens = createAsyncThunk<(
CollectionToken | undefined)[], fetchNFTMetadataParams>(
  'collection/fetchNFTMetadata',
  async ({ library, collectionToken, startIndex }) => {
    const CHUNK_SIZE = 20;
    const tokensToFetch = new Array(CHUNK_SIZE)
      .fill(null)
      .map((value, index) => startIndex + index);

    const dataPromises = tokensToFetch.map(async (tokenId) => {
      let tokenInfo: TokenInfo;

      try {
        tokenInfo = await getTokenFromContract(library, collectionToken, tokenId.toString());
      } catch (e) {
        console.error(new Error(`Unable to fetch data for ${collectionToken} with id ${tokenId}`));

        return undefined;
      }

      const token = transformNFTTokenToCollectionToken(tokenInfo, tokenId, 0.154);

      if (!token) {
        console.error(new Error(`Unable to parse data for ${collectionToken} with id ${tokenId}`));
      }

      return token;
    });

    return Promise.all(dataPromises);
  },
  );
