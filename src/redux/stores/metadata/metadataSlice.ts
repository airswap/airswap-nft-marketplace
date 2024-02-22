import { TokenInfo } from '@airswap/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { EnsAddressesMap } from '../../../entities/Address/Address';
import { CollectionTokenInfoMap } from '../../../entities/CollectionToken/CollectionToken';
import { fetchProtocolFee } from './metadataActions';
import { getCollectionContractMetadata, getCurrencyTokenInfo } from './metadataApi';
import {
  getCollectionTokensLocalStorageKey,
  getLocalStorageCollectionImage,
  setLocalStorageCollectionImageBanner,
} from './metdataHelpers';

export interface MetadataState {
  isLoading: boolean;
  bannerImage?: string | null;
  currencyTokenInfo?: TokenInfo;
  collectionName?: string | null;
  collectionTokens: CollectionTokenInfoMap;
  ensAddresses: EnsAddressesMap
  projectFee: number;
  protocolFee: number;
}

const initialState: MetadataState = {
  isLoading: false,
  bannerImage: getLocalStorageCollectionImage(),
  collectionTokens: {},
  ensAddresses: {},
  projectFee: 0,
  protocolFee: 5,
};

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>): MetadataState => ({
      ...state,
      isLoading: action.payload,
    }),
    setCollectionTokens: (state, action: PayloadAction<CollectionTokenInfoMap>): MetadataState => {
      const values = Object.values(action.payload);

      if (values.length) {
        localStorage.setItem(getCollectionTokensLocalStorageKey(values[0].address), JSON.stringify(action.payload));
      }

      return {
        ...state,
        collectionTokens: action.payload,
      };
    },
    setEnsAddresses: (state, action: PayloadAction<EnsAddressesMap>): MetadataState => ({
      ...state,
      ensAddresses: action.payload,
    }),
  },
  extraReducers: builder => {
    builder.addCase(getCurrencyTokenInfo.pending, (state): MetadataState => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(getCurrencyTokenInfo.fulfilled, (state, action): MetadataState => ({
      ...state,
      isLoading: false,
      currencyTokenInfo: action.payload,
    }));

    builder.addCase(getCurrencyTokenInfo.rejected, (state, action): MetadataState => {
      console.error(action.error);

      return {
        ...state,
      };
    });

    builder.addCase(fetchProtocolFee.fulfilled, (state, action): MetadataState => ({
      ...state,
      protocolFee: action.payload,
    }));

    builder.addCase(getCollectionContractMetadata.fulfilled, (state, action): MetadataState => {
      const { openSeaMetadata, name } = action.payload;
      const { imageBannerUrl, imageUrl, collectionName } = openSeaMetadata;
      const bannerImage = imageBannerUrl || imageUrl || null;

      setLocalStorageCollectionImageBanner(bannerImage);

      return {
        ...state,
        bannerImage,
        collectionName: collectionName || name || null,
      };
    });
  },
});

export const {
  setIsLoading,
  setCollectionTokens,
  setEnsAddresses,
} = metadataSlice.actions;

export default metadataSlice.reducer;
