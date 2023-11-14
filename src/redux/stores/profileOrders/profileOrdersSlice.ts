import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INDEXER_ORDERS_OFFSET } from '../../../constants/indexer';
import { getProfileOrders } from './profileOrdersApi';

export interface ProfileOrdersState {
  hasServerError: boolean;
  isLoading: boolean;
  isTotalOrdersReached: boolean;
  offset: number;
  orders: FullOrder[];
}

const initialState: ProfileOrdersState = {
  hasServerError: false,
  isLoading: false,
  isTotalOrdersReached: false,
  offset: 0,
  orders: [],
};

const profileSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    reset: (): ProfileOrdersState => ({
      ...initialState,
    }),
    setOrders: (state, action: PayloadAction<FullOrder[]>): ProfileOrdersState => ({
      ...state,
      orders: action.payload,
    }),
    setOrdersOffset: (state, action: PayloadAction<number>): ProfileOrdersState => ({
      ...state,
      offset: action.payload,
    }),
  },
  extraReducers: builder => {
    builder.addCase(getProfileOrders.pending, (state): ProfileOrdersState => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(getProfileOrders.fulfilled, (state, action): ProfileOrdersState => {
      const newOrders = [
        ...state.orders,
        ...action.payload,
      ];
      const isTotalOrdersReached = action.payload.length < INDEXER_ORDERS_OFFSET;

      return {
        ...state,
        isLoading: false,
        isTotalOrdersReached,
        orders: newOrders,
      };
    });

    builder.addCase(getProfileOrders.rejected, (state, action): ProfileOrdersState => {
      console.error('profileOrders/getProfileOrders', action);

      return {
        ...state,
        hasServerError: true,
        isTotalOrdersReached: true,
        isLoading: false,
      };
    });
  },
});

export const {
  reset,
  setOrders,
  setOrdersOffset,
} = profileSlice.actions;

export default profileSlice.reducer;
