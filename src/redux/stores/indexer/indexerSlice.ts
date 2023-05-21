import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getFilteredOrders, initialize } from './indexerApi';

export interface IndexerState {
  urls: string[];
  orders: FullOrder[];
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: IndexerState = {
  urls: [],
  orders: [],
  isLoading: false,
  isInitialized: false,
};

export const indexerSlice = createSlice({
  name: 'indexer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initialize.fulfilled, (state, action: PayloadAction<string[]>): IndexerState => ({
      ...state,
      isInitialized: !!action.payload.length,
      urls: action.payload,
    }));
    builder.addCase(getFilteredOrders.fulfilled, (state, action: PayloadAction<FullOrder[]>): IndexerState => ({
      ...state,
      orders: action.payload,
      isLoading: false,
    }));
    builder.addCase(getFilteredOrders.pending, (state): IndexerState => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(getFilteredOrders.rejected, (state): IndexerState => ({
      ...state,
      isLoading: false,
    }));
  },
});

export default indexerSlice.reducer;
