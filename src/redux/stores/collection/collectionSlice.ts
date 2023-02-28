import { createSlice } from '@reduxjs/toolkit';

import { CHUNK_SIZE } from '../../../constants/collection';
import { length } from '../../../constants/tokenIds.json';
import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
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
  lastTokenIndex: 0,
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
      // TODO: handle error; undefined means there was an error fetching data for an nft
      const filteredTokens = action.payload.filter(token => token !== undefined) as CollectionToken[];

      const newTokensData = [
        ...state.tokensData,
        ...filteredTokens,
      ].sort((a, b) => a.id - b.id);

      const newLastTokenIndex = state.lastTokenIndex + CHUNK_SIZE;

      return {
        ...state,
        allTokensAreLoaded: newLastTokenIndex >= length,
        isLoading: false,
        tokensData: newTokensData,
        lastTokenIndex: newLastTokenIndex,
      };
    });

    // TODO: Add error handling https://github.com/airswap/airswap-marketplace/issues/48
    builder.addCase(fetchCollectionTokens.rejected, (state, action) => {
      console.error('fetchCollectionTokens.rejected', action.error);
    });
  },
});

export default collectionSlice.reducer;
