import { getCollectionTokenInfo } from '@airswap/metadata';
import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface FetchOwnedTokenMetaParams {
  library: Web3Provider;
  collectionToken: string;
  tokenIds: number[];
}
export const fetchOwnedTokenMeta = createAsyncThunk<
CollectionTokenInfo[], FetchOwnedTokenMetaParams>(
  'nftDetail/fetchNftMeta',
  async ({ library, collectionToken, tokenIds }) => {
    const tokenInfo: CollectionTokenInfo[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const tokenId of tokenIds) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const tokenMeta = await getCollectionTokenInfo(library, collectionToken, tokenId.toString());
        tokenInfo.push(tokenMeta);
      } catch (e) {
        throw new Error(`Unable to fetch data for ${collectionToken} with id ${tokenIds}`);
      }
    }
    return tokenInfo;
  },
);
