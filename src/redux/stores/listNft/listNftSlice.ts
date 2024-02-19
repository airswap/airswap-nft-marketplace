import { CollectionTokenInfo, FullOrder } from '@airswap/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedFullOrder } from '../../../entities/FullOrder/FullOrder';
import { AppError } from '../../../errors/appError';
import { getActiveUserOrders } from './listNftApi';

interface LastUserOrder {
  order: FullOrder;
  token: CollectionTokenInfo;
}

export interface ListNftState {
  isLoadingUserOrders: boolean;
  lastUserOrder?: LastUserOrder;
  userOrders: ExtendedFullOrder[];
  error?: AppError;
}

const initialState: ListNftState = {
  isLoadingUserOrders: false,
  userOrders: [],
};

export const listNftSlice = createSlice({
  name: 'make-otc',
  initialState,
  reducers: {
    setLastUserOrder: (
      state,
      action: PayloadAction<LastUserOrder>,
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
  extraReducers: (builder) => {
    builder.addCase(getActiveUserOrders.pending, (state): ListNftState => ({
      ...state,
      isLoadingUserOrders: true,
    }));
    builder.addCase(getActiveUserOrders.rejected, (state): ListNftState => ({
      ...state,
      isLoadingUserOrders: false,
    }));
    builder.addCase(getActiveUserOrders.fulfilled, (state, action): ListNftState => ({
      ...state,
      isLoadingUserOrders: false,
      userOrders: action.payload,
    }));
  },
});

export const {
  setLastUserOrder,
  clearLastUserOrder,
  setError,
  reset,
} = listNftSlice.actions;

export default listNftSlice.reducer;
