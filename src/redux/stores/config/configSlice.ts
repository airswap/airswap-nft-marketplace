import { TokenKinds } from '@airswap/constants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getCollectionTokenKind, getCurrencyTokenKind } from './configApi';

export interface ConfigState {
  isFailed: boolean;
  isLoadingCollectionTokenKind: boolean;
  isLoadingCurrencyTokenKind: boolean;
  isSuccessful: boolean;
  chainId: number;
  currencyToken: string;
  currencyTokenKind?: TokenKinds;
  collectionToken: string;
  collectionTokenKind?: TokenKinds;
  collectionName: string;
  collectionImage: string;
  ipfcGatewayURL: string;
}
const initialState: ConfigState = {
  isFailed: false,
  isLoadingCollectionTokenKind: false,
  isLoadingCurrencyTokenKind: false,
  isSuccessful: false,
  chainId: process.env.REACT_APP_CHAIN_ID ? parseInt(process.env.REACT_APP_CHAIN_ID, 10) : 1,
  currencyToken: (process.env.REACT_APP_CURRENCY_TOKEN || '').toLowerCase(),
  collectionToken: (process.env.REACT_APP_COLLECTION_TOKEN || '').toLowerCase(),
  collectionName: process.env.REACT_APP_COLLECTION_NAME || '',
  collectionImage: process.env.REACT_APP_COLLECTION_IMAGE || '',
  ipfcGatewayURL: process.env.REACT_APP_IPFC_GATEWAY_URL || 'https://ipfs.io/ipfs/',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    reset: (): ConfigState => ({
      ...initialState,
    }),
    setIsSuccessful: (state, action: PayloadAction<boolean>): ConfigState => ({
      ...state,
      isSuccessful: action.payload,
    }),
  },
  extraReducers: builder => {
    builder.addCase(getCollectionTokenKind.pending, (state): ConfigState => ({
      ...state,
      isLoadingCollectionTokenKind: true,
    }));
    builder.addCase(getCollectionTokenKind.fulfilled, (state, action): ConfigState => ({
      ...state,
      isLoadingCollectionTokenKind: false,
      collectionTokenKind: action.payload,
    }));
    builder.addCase(getCollectionTokenKind.rejected, (state): ConfigState => ({
      ...state,
      isLoadingCollectionTokenKind: false,
      isFailed: true,
    }));
    builder.addCase(getCurrencyTokenKind.pending, (state): ConfigState => ({
      ...state,
      isLoadingCurrencyTokenKind: true,
    }));
    builder.addCase(getCurrencyTokenKind.fulfilled, (state, action): ConfigState => ({
      ...state,
      isLoadingCurrencyTokenKind: false,
      currencyTokenKind: action.payload,
    }));
    builder.addCase(getCurrencyTokenKind.rejected, (state): ConfigState => ({
      ...state,
      isLoadingCurrencyTokenKind: false,
      isFailed: true,
    }));
  },
});

export const {
  setIsSuccessful,
  reset,
} = configSlice.actions;

export default configSlice.reducer;
