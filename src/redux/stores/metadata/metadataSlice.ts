import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getCurrencyAndCollectionTokenInfo } from './metadataApi';

export interface MetadataState {
  isLoading: boolean;
  tokens: {
    [address: string]: any;
  },
}

const initialState: MetadataState = {
  isLoading: false,
  tokens: {},
};

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
  },
  extraReducers: builder => {
    builder.addCase(getCurrencyAndCollectionTokenInfo.pending, (state) => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(getCurrencyAndCollectionTokenInfo.fulfilled, (state, action) => {
      const tokens = action.payload.reduce((total, token) => ({
        ...total,
        ...(token ? { [token.address]: token } : {}),
      }), {});

      return {
        ...state,
        isLoading: false,
        tokens,
      };
    });

    builder.addCase(getCurrencyAndCollectionTokenInfo.rejected, (state, action) => {
      console.error(action.error);

      return {
        ...state,
      };
    });
  },
});

export const {
  setIsLoading,
} = metadataSlice.actions;

export default metadataSlice.reducer;
