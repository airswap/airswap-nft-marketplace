import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Address } from '../../../entities/Address/Address';
import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import { getErc1155OwnerAddresses, getNftOrderByTokenId, getNftTransactionReceipts } from './nftDetailApi';

export interface NftDetailState {
  isLoading: boolean;
  isLoadingOwners: boolean;
  isLoadingTransactionReceipts: boolean;
  isOrderNotFound: boolean;
  order?: FullOrder;
  owners: Address[];
  ownersPageKey?: string | null;
  tokenId?: string;
  transactionLogs: NftTransactionLog[];
}

const initialState: NftDetailState = {
  isLoading: false,
  isLoadingOwners: false,
  isLoadingTransactionReceipts: false,
  isOrderNotFound: false,
  owners: [],
  transactionLogs: [],
};

export const nftDetailSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    reset: (): NftDetailState => ({
      ...initialState,
    }),
    setTokenId: (state, action: PayloadAction<string>): NftDetailState => ({
      ...state,
      tokenId: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(getNftOrderByTokenId.pending, (state): NftDetailState => ({
      ...state,
      isLoading: true,
      isOrderNotFound: false,
    }));
    builder.addCase(getNftOrderByTokenId.fulfilled, (state, action): NftDetailState => ({
      ...state,
      isLoading: false,
      isOrderNotFound: !action.payload,
      order: action.payload,
    }));
    builder.addCase(getNftOrderByTokenId.rejected, (state): NftDetailState => ({
      ...state,
      isLoading: false,
    }));
    builder.addCase(getNftTransactionReceipts.pending, (state): NftDetailState => ({
      ...state,
      isLoadingTransactionReceipts: true,
    }));
    builder.addCase(getNftTransactionReceipts.fulfilled, (state, action): NftDetailState => ({
      ...state,
      transactionLogs: action.payload,
      isLoadingTransactionReceipts: false,
    }));
    builder.addCase(getNftTransactionReceipts.rejected, (state): NftDetailState => ({
      ...state,
      transactionLogs: [],
      isLoadingTransactionReceipts: false,
    }));
    builder.addCase(getErc1155OwnerAddresses.pending, (state): NftDetailState => ({
      ...state,
      isLoadingOwners: true,
    }));
    builder.addCase(getErc1155OwnerAddresses.fulfilled, (state, action): NftDetailState => ({
      ...state,
      isLoadingOwners: false,
      owners: action.payload.owners,
      ownersPageKey: action.payload.pageKey,
    }));
    builder.addCase(getErc1155OwnerAddresses.rejected, (state): NftDetailState => ({
      ...state,
      isLoadingOwners: false,
    }));
  },
});

export const {
  reset,
  setTokenId,
} = nftDetailSlice.actions;

export default nftDetailSlice.reducer;
