import { CollectionTokenInfo } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchOwnedTokenMeta } from './profileApi';

export interface ProfileState {
  isLoading: boolean;
  ownedTokenMeta: CollectionTokenInfo[];
}

const initialState: ProfileState = {
  isLoading: false,
  ownedTokenMeta: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setOwnedTokenMeta: (state, action: PayloadAction<string>) => ({
      ...state,
      selectedTokenId: action.payload,
    }),
    setError: (state, action: PayloadAction<string>) => ({
      ...state,
      error: {
        hasError: true,
        message: action.payload,
      },
    }),
  },
  extraReducers: builder => {
    builder.addCase(fetchOwnedTokenMeta.pending, state => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(fetchOwnedTokenMeta.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      ownedTokenMeta: action.payload,
    }));

    builder.addCase(fetchOwnedTokenMeta.rejected, (_state, action) => {
      console.error('fetchNftMeta.rejected', action);
    });
  },
});

export const {
  setOwnedTokenMeta, setError,
} = profileSlice.actions;

export default profileSlice.reducer;
