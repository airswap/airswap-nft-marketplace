import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getNftOrderByTokenId } from './nftDetailApi';

export interface NftDetailState {
  isLoading: boolean;
  isOrderNotFound: boolean;
  order?: FullOrder;
  tokenId?: number;
}

const initialState: NftDetailState = {
  isLoading: false,
  isOrderNotFound: false,
};

export const nftDetailSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    reset: (): NftDetailState => ({
      ...initialState,
    }),
    setTokenId: (state, action: PayloadAction<number>): NftDetailState => ({
      ...state,
      tokenId: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(getNftOrderByTokenId.fulfilled, (state, action: PayloadAction<FullOrder | undefined>): NftDetailState => ({
      ...state,
      isLoading: false,
      isOrderNotFound: !action.payload,
      order: action.payload,
    }));
    builder.addCase(getNftOrderByTokenId.pending, (state): NftDetailState => ({
      ...state,
      isLoading: true,
      isOrderNotFound: false,
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
