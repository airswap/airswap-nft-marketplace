import { TokenInfo } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EnsAddressesMap } from '../../../entities/Address/Address';
import { CollectionTokenInfoMap } from '../../../entities/CollectionToken/CollectionToken';
import { fetchProtocolFee } from './metadataActions';
import { getCurrencyTokenInfo } from './metadataApi';
import { getCollectionTokensLocalStorageKey } from './metdataHelpers';

export interface MetadataState {
  isLoading: boolean;
  currencyTokenInfo?: TokenInfo;
  collectionTokens: CollectionTokenInfoMap;
  ensAddresses: EnsAddressesMap
  projectFee: number;
  protocolFee: number;
}

const initialState: MetadataState = {
  isLoading: false,
  collectionTokens: {},
  ensAddresses: {},
  projectFee: 0,
  protocolFee: 7,
};

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
    setCollectionTokens: (state, action: PayloadAction<CollectionTokenInfoMap>) => {
      const values = Object.values(action.payload);

      if (values.length) {
        localStorage.setItem(getCollectionTokensLocalStorageKey(values[0].address), JSON.stringify(action.payload));
      }

      return {
        ...state,
        collectionTokens: action.payload,
      };
    },
    setEnsAddresses: (state, action: PayloadAction<EnsAddressesMap>) => ({
      ...state,
      ensAddresses: action.payload,
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
      currencyTokenInfo: action.payload,
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
  setCollectionTokens,
  setEnsAddresses,
} = metadataSlice.actions;

export default metadataSlice.reducer;
