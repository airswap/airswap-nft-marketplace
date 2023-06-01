import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialize } from './indexerApi';

export interface IndexerState {
  urls: string[];
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: IndexerState = {
  urls: [],
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
      isInitialized: true,
      urls: [...action.payload, 'http://localhost:4001'],
    }));
  },
});

export default indexerSlice.reducer;
