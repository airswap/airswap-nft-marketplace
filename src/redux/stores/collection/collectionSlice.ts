import { createSlice } from '@reduxjs/toolkit';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { getUniqueArrayChildren } from '../../../helpers/array';
import { fetchCollectionTokens } from './collectionApi';

export interface CollectionState {
  isLoading: boolean;
  tokensData: CollectionToken[];
}

const initialState: CollectionState = {
  isLoading: false,
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
      const filteredTokens = action.payload.filter(token => token !== undefined) as CollectionToken[];

      const newTokensData = getUniqueArrayChildren([
        ...state.tokensData,
        ...filteredTokens,
      ].sort((a, b) => a.id - b.id), 'id') as CollectionToken[];

      return {
        ...state,
        isLoading: false,
        tokensData: newTokensData,
      };
    });

    // TODO: Add error handling https://github.com/airswap/airswap-marketplace/issues/48
    builder.addCase(fetchCollectionTokens.rejected, (state, action) => {
      console.error('fetchCollectionTokens.rejected', action.error);
    });
  },
});

export default collectionSlice.reducer;
