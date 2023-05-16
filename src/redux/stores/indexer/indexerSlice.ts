import { Server } from '@airswap/libraries';
import { FullOrder } from '@airswap/types';
import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { initializeIndexers } from './indexerApi';

export interface IndexerState {
  servers: Server[];
  orders: FullOrder[];
  isLoading: boolean;
  isActive: boolean;
}

const initialState: IndexerState = {
  servers: [],
  orders: [],
  isLoading: false,
  isActive: false,
};

export const indexerSlice = createSlice({
  name: 'indexer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initializeIndexers.fulfilled, (state, action): IndexerState => (
      {
        ...state,
        ...(!!action.payload.length && { isActive: true }),
        servers: action.payload,
      }
    ));
  },
});

export const selectIndexerReducer = (state: RootState) => state.indexer;
export default indexerSlice.reducer;
