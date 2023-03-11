import { TokenInfo } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { getCurrencyAndCollectionTokenInfo } from './metadataApi';

export interface MetadataState {
  isLoading: boolean;
  tokens: {
    [address: string]: TokenInfo;
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
      const tokens: { [address: string]: TokenInfo } = action.payload.reduce((total, token) => ({
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

export const selectCollectionTokenInfo = (state: RootState): TokenInfo | undefined => state.metadata.tokens[state.config.collectionToken];
export const selectCurrencyTokenInfo = (state: RootState): TokenInfo | undefined => state.metadata.tokens[state.config.currencyToken];

export default metadataSlice.reducer;
