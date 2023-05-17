import { Server } from '@airswap/libraries';
import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getFilteredOrders, initializeIndexers } from './indexerApi';

export interface IndexerState {
  servers: Server[];
  orders: FullOrder[];
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: IndexerState = {
  servers: [],
  orders: [],
  isLoading: false,
  isInitialized: false,
};

export const indexerSlice = createSlice({
  name: 'indexer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeIndexers.fulfilled, (state, action: PayloadAction<Server[]>): IndexerState => ({
      ...state,
      isInitialized: !!action.payload.length,
      servers: action.payload,
    }
    ));
    builder.addCase(getFilteredOrders.fulfilled, (state, action) => ({
      ...state,
      orders: action.payload,
      isLoading: false,
    }));
    builder.addCase(getFilteredOrders.pending, (state) => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(getFilteredOrders.rejected, (state) => ({
      ...state,
      isLoading: false,
    }));
  },
});

export default indexerSlice.reducer;
