import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INDEXER_ORDERS_OFFSET } from '../../../constants/indexer';
import { getCollectionOrders } from './collectionApi';

export interface CollectionState {
  hasServerError: boolean;
  isTotalOrdersReached: boolean;
  offset: number;
  orders: FullOrder[];
  isLoading: boolean;
}

const initialState: CollectionState = {
  hasServerError: false,
  isTotalOrdersReached: false,
  offset: 0,
  orders: [],
  isLoading: false,
};

export const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    reset: (): CollectionState => ({
      ...initialState,
    }),
    setOffset: (state, action: PayloadAction<number>): CollectionState => ({
      ...state,
      offset: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(getCollectionOrders.fulfilled, (state, action: PayloadAction<FullOrder[]>): CollectionState => {
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
    builder.addCase(getCollectionOrders.pending, (state): CollectionState => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(getCollectionOrders.rejected, (state): CollectionState => ({
      ...state,
      hasServerError: true,
      isTotalOrdersReached: true,
      isLoading: false,
    }));
  },
});

export const {
  reset,
  setOffset,
} = collectionSlice.actions;

export default collectionSlice.reducer;
