import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EventLog {
  from?: string;
  to?: string;
  tokenId: number;
  type: string;
}

export interface TokenState {
  selectedTokenId?: number;
  eventLogs: EventLog[];
}

const initialState: TokenState = {
  eventLogs: [],
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    addEventLog: (state, action: PayloadAction<EventLog>) => ({
      ...state,
      eventLogs: [...state.eventLogs, action.payload],
    }),
    setSelectedTokenId: (state, action: PayloadAction<number>) => ({
      ...state,
      selectedTokenId: action.payload,
    }),
  },
});

export const {
  addEventLog, setSelectedTokenId,
} = tokenSlice.actions;

export default tokenSlice.reducer;
