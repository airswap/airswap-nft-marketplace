import { createSlice } from '@reduxjs/toolkit';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { getUniqueArrayChildren } from '../../../helpers/array';
import { fetchNFTMetadata } from './collectionApi';

export interface CollectionState {
  isLoading: boolean;
  lastTokenIndex: number;
  tokensData: CollectionToken[];
}

const initialState: CollectionState = {
  isLoading: false,
  lastTokenIndex: 1,
  tokensData: [],
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchNFTMetadata.pending, state => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(fetchNFTMetadata.fulfilled, (state, action) => {
      const newTokensData = getUniqueArrayChildren([
        ...state.tokensData,
        ...action.payload,
      ].sort((a, b) => a.id - b.id), 'id') as CollectionToken[];
      const lastToken = newTokensData[newTokensData.length - 1];

      return {
        ...state,
        isLoading: false,
        tokensData: newTokensData,
        lastTokenIndex: lastToken ? lastToken.id : 1,
      };
    });

    // TODO: Add error handling
    // builder.addCase(fetchNFTMetadata.rejected, (state, action) => {
  },
});

export default collectionSlice.reducer;
