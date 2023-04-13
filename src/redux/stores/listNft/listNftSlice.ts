import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppError } from '../../../errors/appError';

export interface ListNftState {
  lastUserOrder?: FullOrder;
  error?: AppError;
}

const lastUserOrderLocalStorageKey = 'airswap-marketplace/lastUserOrder';
const localStorageLastUserOrder = localStorage.getItem(lastUserOrderLocalStorageKey);

const initialState: ListNftState = {
  ...(localStorageLastUserOrder && { lastUserOrder: JSON.parse(localStorageLastUserOrder) }),
};

export const listNftSlice = createSlice({
  name: 'make-otc',
  initialState,
  reducers: {
    setUserOrder: (
      state,
      action: PayloadAction<FullOrder>,
    ): ListNftState => {
      localStorage.setItem(lastUserOrderLocalStorageKey, JSON.stringify(action.payload));

      return {
        ...state,
        lastUserOrder: action.payload,
      };
    },
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
