import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CollectionState {
  isLoading: boolean;
  tokenIds: string[];
  index: number;
  tokensData: any[];
}

const initialState: CollectionState = {
  isLoading: false,
  tokenIds: [],
  index: 0,
  tokensData: [],
};

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    incrementIndex: (state, action: PayloadAction<number>) => ({
      ...state,
      index: state.index + action.payload,
    }),
    setTokensData: (state, action: PayloadAction<any[]>) => ({
      ...state,
      tokensData: [...state.tokensData, ...action.payload],
    }),
    setTokenIds: (state, action: PayloadAction<string[]>) => ({
      ...state,
      tokenIds: [...action.payload],
    }),
  },
});

export const { incrementIndex, setTokensData, setTokenIds } = collectionSlice.actions;

export default collectionSlice.reducer;

// FIXME: Any
