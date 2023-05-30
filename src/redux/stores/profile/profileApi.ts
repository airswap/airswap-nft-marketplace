import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getCollectionToken } from '../../../entities/CollectionToken/CollectionTokenHelpers';

interface FetchOwnedTokenMetaParams {
  library: Web3Provider;
  collectionToken: string;
  tokenIds: number[];
}
export const fetchOwnedTokenMeta = createAsyncThunk<
CollectionTokenInfo[], FetchOwnedTokenMetaParams>(
  'nftDetail/fetchNftMeta',
  async ({ library, collectionToken, tokenIds }) => {
    const responses = await Promise.all(tokenIds.map(tokenId => getCollectionToken(library, collectionToken, tokenId)));

    return responses.filter(token => token !== undefined) as CollectionTokenInfo[];
  },
);
