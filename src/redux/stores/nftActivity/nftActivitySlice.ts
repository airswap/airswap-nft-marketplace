import { createSlice } from '@reduxjs/toolkit';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import { getNftTransactionReceipts } from './nftActivityApi';

export interface NftActivityState {
  isLoading: boolean;
  logs: NftTransactionLog[];
  pageKey?: string | null;
}

const initialState: NftActivityState = {
  isLoading: false,
  logs: [],
};

export const NftActivitySlice = createSlice({
  name: 'nftActivityReducer',
  initialState,
  reducers: {
    reset: (): NftActivityState => ({
      ...initialState,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(getNftTransactionReceipts.pending, (state): NftActivityState => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(getNftTransactionReceipts.fulfilled, (state, action): NftActivityState => ({
      ...state,
      logs: action.payload.logs,
      pageKey: action.payload.pageKey,
      isLoading: false,
    }));
    builder.addCase(getNftTransactionReceipts.rejected, (state): NftActivityState => ({
      ...state,
      logs: [],
      isLoading: false,
    }));
  },
});

export const {
  reset,
} = NftActivitySlice.actions;

export default NftActivitySlice.reducer;
