import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppError } from '../../../errors/appError';

export interface ListNftState {
  lastUserOrder?: FullOrder;
  error?: AppError;
}

const initialState: ListNftState = {};

export const listNftSlice = createSlice({
  name: 'make-otc',
  initialState,
  reducers: {
    setUserOrder: (
      state,
      action: PayloadAction<FullOrder>,
    ): ListNftState => ({
      ...state,
      lastUserOrder: action.payload,
    }),
    clearLastUserOrder: (state): ListNftState => ({
      ...state,
      lastUserOrder: undefined,
    }),
    setError: (
      state,
      action: PayloadAction<AppError | undefined>,
    ): ListNftState => ({
      ...state,
      error: action.payload,
    }),
    reset: (): ListNftState => initialState,
  },
});

export const {
  setUserOrder,
  clearLastUserOrder,
  setError,
  reset,
} = listNftSlice.actions;

export default listNftSlice.reducer;
