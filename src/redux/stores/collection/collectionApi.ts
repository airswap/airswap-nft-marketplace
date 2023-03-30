import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { getCollectionToken } from '../../../entities/CollectionToken/CollectionTokenHelpers';

interface fetchNFTMetadataParams {
  library: Web3Provider,
  collectionToken: string,
  tokenIds: number[],
}

export const fetchCollectionTokens = createAsyncThunk<(
CollectionToken | undefined)[], fetchNFTMetadataParams>(
  'collection/fetchNFTMetadata',
  async ({ library, collectionToken, tokenIds }) => {
    const dataPromises = tokenIds.map(async (tokenId) => getCollectionToken(library, collectionToken, tokenId));

    return Promise.all(dataPromises);
  },
  );
