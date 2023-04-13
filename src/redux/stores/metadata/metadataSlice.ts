import { TokenInfo } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { fetchProtocolFee } from './metadataActions';
import { getCurrencyTokenInfo } from './metadataApi';

export interface MetadataState {
  isLoading: boolean;
  projectFee: number;
  protocolFee: number;
  tokens: {
    [address: string]: TokenInfo;
  },
}

const initialState: MetadataState = {
  isLoading: false,
  projectFee: 0,
  protocolFee: 7,
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
    builder.addCase(getCurrencyTokenInfo.pending, (state) => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(getCurrencyTokenInfo.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      tokens: {
        ...state.tokens,
        [action.payload.address]: action.payload,
      },
    }));

    builder.addCase(getCurrencyTokenInfo.rejected, (state, action) => {
      console.error(action.error);

      return {
        ...state,
      };
    });

    builder.addCase(fetchProtocolFee.fulfilled, (state, action) => ({
      ...state,
      protocolFee: action.payload,
    }));
  },
});

export const {
  setIsLoading,
} = metadataSlice.actions;

export const selectCurrencyTokenInfo = (state: RootState): TokenInfo | undefined => state.metadata.tokens[state.config.currencyToken];

export default metadataSlice.reducer;
