import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { fetchNftMeta } from './nftDetailApi';

export interface EventLog {
  from?: string;
  to?: string;
  tokenId: number;
  type: string;
}

export interface NftDetailError {
  hasError: boolean;
  message?: string;
}

export interface TokenState {
  isLoading: boolean;
  error: NftDetailError;
  selectedTokenId?: string;
  tokenMeta?: CollectionToken
  eventLogs: EventLog[];
}

const initialState: TokenState = {
  isLoading: false,
  error: {
    hasError: false,
  },
  eventLogs: [],
};

const nftDetailSlice = createSlice({
  name: 'nftDetail',
  initialState,
  reducers: {
    addEventLog: (state, action: PayloadAction<EventLog>) => ({
      ...state,
      eventLogs: [...state.eventLogs, action.payload],
    }),
    setSelectedTokenId: (state, action: PayloadAction<string>) => ({
      ...state,
      selectedTokenId: action.payload,
    }),
    setError: (state, action: PayloadAction<string>) => ({
      ...state,
      error: {
        hasError: true,
        message: action.payload,
      },
    }),
  },
  extraReducers: builder => {
    builder.addCase(fetchNftMeta.pending, state => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(fetchNftMeta.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      tokenMeta: action.payload,
    }));

    builder.addCase(fetchNftMeta.rejected, (_state, action) => {
      console.error('fetchNftMeta.rejected', action);
    });
  },
});

export const {
  addEventLog, setSelectedTokenId, setError,
} = nftDetailSlice.actions;

export default nftDetailSlice.reducer;
