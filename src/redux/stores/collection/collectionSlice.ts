import { createSlice } from '@reduxjs/toolkit';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { getUniqueArrayChildren } from '../../../helpers/array';
import { fetchCollectionTokens } from './collectionApi';

export interface CollectionState {
  allTokensAreLoaded: boolean;
  isLoading: boolean;
  lastTokenIndex: number;
  tokensData: CollectionToken[];
}

const initialState: CollectionState = {
  allTokensAreLoaded: false,
  isLoading: false,
  lastTokenIndex: 1,
  tokensData: [],
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCollectionTokens.pending, state => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(fetchCollectionTokens.fulfilled, (state, action) => {
      // When fetchNFTMetadata returns undefined for a token we assume that's the end of the token list
      // TODO: We might want to revise this when we add support for irregular token id's. https://github.com/airswap/airswap-marketplace/issues/49
      const allTokensAreLoaded = action.payload.includes(undefined);
      const filteredTokens = action.payload.filter(token => token !== undefined) as CollectionToken[];

      const newTokensData = getUniqueArrayChildren([
        ...state.tokensData,
        ...filteredTokens,
      ].sort((a, b) => a.id - b.id), 'id') as CollectionToken[];
      const lastToken = newTokensData[newTokensData.length - 1];

      return {
        ...state,
        allTokensAreLoaded,
        isLoading: false,
        tokensData: newTokensData,
        lastTokenIndex: lastToken ? lastToken.id : 1,
      };
    });

    // TODO: Add error handling https://github.com/airswap/airswap-marketplace/issues/48
    builder.addCase(fetchCollectionTokens.rejected, (state, action) => {
      console.error('fetchCollectionTokens.rejected', action.error);
    });
  },
});

export default collectionSlice.reducer;
