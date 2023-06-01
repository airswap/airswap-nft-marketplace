import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { initialize } from './indexerApi';

export interface IndexerState {
  isInitialized: boolean;
  isLoading: boolean;
  urls: string[];
}

const initialState: IndexerState = {
  isInitialized: false,
  isLoading: false,
  urls: [],
};

export const indexerSlice = createSlice({
  name: 'indexer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initialize.fulfilled, (state, action: PayloadAction<string[]>): IndexerState => ({
      ...state,
      // TODO: Remove this when merge branch
      isInitialized: true,
      urls: [...action.payload, 'http://localhost:4001'],
    }));
  },
});

export default indexerSlice.reducer;
