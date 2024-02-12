import { FullOrder } from '@airswap/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INDEXER_ORDERS_OFFSET } from '../../../constants/indexer';
import { ExtendedFullOrder } from '../../../entities/FullOrder/FullOrder';
import { getUniqueArrayChildren } from '../../../helpers/array';
import { getProfileOrders } from './profileOrdersApi';

export interface ProfileOrdersState {
  hasServerError: boolean;
  isLoading: boolean;
  isTotalOrdersReached: boolean;
  offset: number;
  orders: ExtendedFullOrder[];
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
    setOrders: (state, action: PayloadAction<ExtendedFullOrder[]>): ProfileOrdersState => ({
      ...state,
      orders: action.payload,
    }),
    setOrdersOffset: (state, action: PayloadAction<number>): ProfileOrdersState => ({
      ...state,
      offset: action.payload,
    }),
    startLoading: (state): ProfileOrdersState => ({
      ...state,
      isLoading: true,
    }),
  },
  extraReducers: builder => {
    builder.addCase(getProfileOrders.pending, (state): ProfileOrdersState => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(getProfileOrders.fulfilled, (state, action): ProfileOrdersState => {
      const newOrders = getUniqueArrayChildren<FullOrder>([
        ...state.orders,
        ...action.payload,
      ], 'nonce');
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
  startLoading,
  setOrders,
  setOrdersOffset,
} = profileSlice.actions;

export default profileSlice.reducer;
