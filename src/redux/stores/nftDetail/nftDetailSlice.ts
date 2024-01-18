import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import { getNftOrderByTokenId } from './nftDetailApi';

export interface NftDetailState {
  isLoading: boolean;
  isOrderNotFound: boolean;
  order?: FullOrder;
  tokenId?: string;
  transactionLogs: NftTransactionLog[];
}

const initialState: NftDetailState = {
  isLoading: false,
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
  },
});

export const {
  reset,
  setTokenId,
} = nftDetailSlice.actions;

export default nftDetailSlice.reducer;
