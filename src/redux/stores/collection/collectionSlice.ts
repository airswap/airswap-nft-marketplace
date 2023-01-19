import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Attribute {
  item: string;
  value: number;
}
export interface TokenData {
  name: string;
  image: string;
  description: string;
  attributes: Attribute[];
  price?: number;
}

export interface CollectionState {
  tokenIds: string[];
  index: number;
  tokensData: TokenData[];
}

const initialState: CollectionState = {
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
    setTokensData: (state, action: PayloadAction<TokenData[]>) => ({
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
