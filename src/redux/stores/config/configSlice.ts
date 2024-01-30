import { TokenKinds } from '@airswap/utils';
import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { getCollectionTokenKind, getCurrencyTokenKind, getSwapContractAddress } from './configApi';

export interface ConfigState {
  hasFailedCollectionToken: boolean;
  hasFailedCurrencyToken: boolean;
  hasFailedSwapContract: boolean;
  isLoadingCollectionTokenKind: boolean;
  isLoadingCurrencyTokenKind: boolean;
  chainId: number;
  currencyToken: string;
  currencyTokenKind?: TokenKinds;
  collectionToken: string;
  collectionTokenKind?: TokenKinds;
  collectionName: string;
  collectionImage: string;
  storageServerUrl: string;
  swapContractAddress?: string | null;
}

const initialState: ConfigState = {
  hasFailedCollectionToken: false,
  hasFailedCurrencyToken: false,
  hasFailedSwapContract: false,
  isLoadingCollectionTokenKind: false,
  isLoadingCurrencyTokenKind: false,
  chainId: process.env.REACT_APP_CHAIN_ID ? parseInt(process.env.REACT_APP_CHAIN_ID, 10) : 1,
  currencyToken: (process.env.REACT_APP_CURRENCY_TOKEN || '').toLowerCase(),
  collectionToken: (process.env.REACT_APP_COLLECTION_TOKEN || '').toLowerCase(),
  collectionName: process.env.REACT_APP_COLLECTION_NAME || '',
  collectionImage: process.env.REACT_APP_COLLECTION_IMAGE || '',
  storageServerUrl: process.env.REACT_APP_STORAGE_SERVER_URL || '',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    reset: (): ConfigState => ({
      ...initialState,
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
      hasFailedCollectionToken: true,
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
      hasFailedCurrencyToken: true,
    }));
    builder.addCase(getSwapContractAddress.fulfilled, (state, action): ConfigState => ({
      ...state,
      swapContractAddress: action.payload,
    }));
    builder.addCase(getSwapContractAddress.rejected, (state): ConfigState => ({
      ...state,
      swapContractAddress: null,
      hasFailedSwapContract: true,
    }));
  },
});

export const { reset } = configSlice.actions;

export const selectConfigFailed = ({ config }: RootState): boolean => config.hasFailedCurrencyToken
    || config.hasFailedSwapContract
    || config.hasFailedCollectionToken;

export default configSlice.reducer;
