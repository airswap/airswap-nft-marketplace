import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import { getNftOrderByTokenId, getNftTransactionReceipts } from './nftDetailApi';

export interface NftDetailState {
  isLoading: boolean;
  isLoadingTransactionReceipts: boolean;
  isOrderNotFound: boolean;
  order?: FullOrder;
  tokenId?: string;
  transactionLogs: NftTransactionLog[];
}

const initialState: NftDetailState = {
  isLoading: false,
  isLoadingTransactionReceipts: false,
  isOrderNotFound: false,
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
  },
});

export const {
  reset,
  setTokenId,
} = nftDetailSlice.actions;

export default nftDetailSlice.reducer;
