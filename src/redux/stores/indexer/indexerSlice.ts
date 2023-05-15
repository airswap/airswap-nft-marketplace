import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { fetchIndexerUrls } from './indexerApi';

export interface IndexerState {
  /** List of indexer urls for servers that have responded successfully to
   * the healthcheck within the allowed time. Null during initial fetch. */
  indexerUrls: string[] | null;
  noIndexersFound: boolean;
}

const initialState: IndexerState = {
  indexerUrls: null,
  noIndexersFound: false,
};

export const indexerSlice = createSlice({
  name: 'indexer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIndexerUrls.fulfilled, (state, action): IndexerState => (
      state.indexerUrls?.length && !action.payload.length
      ? { ...state }
      : {
        ...state,
        indexerUrls: action.payload,
        ...(!action.payload.length && { noIndexersFound: true }),
      }
    ));
  },
});

export const selectIndexerReducer = (state: RootState) => state.indexer;
export default indexerSlice.reducer;
