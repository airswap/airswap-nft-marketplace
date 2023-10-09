import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppError } from '../../../errors/appError';
import { getUserOrders } from './listNftApi';

export interface ListNftState {
  isLoadingUserOrders: boolean;
  lastUserOrder?: FullOrder;
  userOrders: FullOrder[];
  error?: AppError;
}

const lastUserOrderLocalStorageKey = 'airswap-marketplace/lastUserOrder';
const localStorageLastUserOrder = localStorage.getItem(lastUserOrderLocalStorageKey);

const initialState: ListNftState = {
  ...(localStorageLastUserOrder && { lastUserOrder: JSON.parse(localStorageLastUserOrder) }),
  isLoadingUserOrders: false,
  userOrders: [],
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
  extraReducers: (builder) => {
    builder.addCase(getUserOrders.pending, (state): ListNftState => ({
      ...state,
      isLoadingUserOrders: true,
    }));
    builder.addCase(getUserOrders.rejected, (state): ListNftState => ({
      ...state,
      isLoadingUserOrders: false,
    }));
    builder.addCase(getUserOrders.fulfilled, (state, action): ListNftState => ({
      ...state,
      isLoadingUserOrders: false,
      userOrders: action.payload,
    }));
  },
});

export const {
  setUserOrder,
  clearLastUserOrder,
  setError,
  reset,
} = listNftSlice.actions;

export default listNftSlice.reducer;
