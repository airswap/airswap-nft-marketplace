import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getNftOrderByOrderNonce } from './orderDetailApi';

export interface OrderDetailState {
  isLoading: boolean;
  isOrderNotFound: boolean;
  order?: FullOrder;
}

const initialState: OrderDetailState = {
  isLoading: false,
  isOrderNotFound: false,
};

export const OrderDetailSlice = createSlice({
  name: 'orderDetailReducer',
  initialState,
  reducers: {
    setIsLoading(state, action: PayloadAction<boolean>): OrderDetailState {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    setOrder(state, action: PayloadAction<FullOrder>): OrderDetailState {
      return {
        ...state,
        order: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNftOrderByOrderNonce.fulfilled, (state, action: PayloadAction<FullOrder | undefined>): OrderDetailState => ({
      ...state,
      isLoading: false,
      isOrderNotFound: !action.payload,
      order: action.payload,
    }));
    builder.addCase(getNftOrderByOrderNonce.pending, (state): OrderDetailState => ({
      ...state,
      isLoading: true,
      isOrderNotFound: false,
    }));
    builder.addCase(getNftOrderByOrderNonce.rejected, (state): OrderDetailState => ({
      ...state,
      isLoading: false,
      isOrderNotFound: true,
    }));
  },
});

export const {
  setIsLoading,
  setOrder,
} = OrderDetailSlice.actions;

export default OrderDetailSlice.reducer;
