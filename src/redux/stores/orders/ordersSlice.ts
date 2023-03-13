import { OrderERC20 } from '@airswap/types';
import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { AppError } from '../../../errors/appError';
import { RootState } from '../../store';
import { approve, take } from './ordersActions';

export interface OrdersState {
  orders: OrderERC20[];
  status: 'idle' | 'requesting' | 'approving' | 'taking' | 'failed' | 'reset';
  reRequestTimerId: number | null;
  errors: AppError[];
}

const initialState: OrdersState = {
  orders: [],
  status: 'idle',
  reRequestTimerId: null,
  errors: [],
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setErrors: (state, action: PayloadAction<AppError[]>) => ({
      ...state,
      errors: action.payload,
    }),
    clear: () => initialState,
    setReRequestTimerId: (state, action: PayloadAction<number>) => ({
      ...state,
      reRequestTimerId: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(take.pending, (state) => ({
        ...state,
        status: 'taking',
      }))
      .addCase(take.fulfilled, (state) => {
        if (state.reRequestTimerId) {
          clearTimeout(state.reRequestTimerId);
        }

        return {
          ...state,
          status: 'idle',
          reRequestTimerId: null,
        };
      })
      .addCase(take.rejected, (state) => ({
        ...state,
        status: 'failed',
      }))
      .addCase(approve.pending, (state) => ({
        ...state,
        status: 'approving',
      }))
      .addCase(approve.fulfilled, (state) => ({
        ...state,
        status: 'idle',
      }))
      .addCase(approve.rejected, (state) => ({
        ...state,
        status: 'failed',
      }));
  },
});

export const {
  clear,
  setErrors,
} = ordersSlice.actions;

export const selectFirstOrder = (state: RootState) => state.orders.orders[0];
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersErrors = (state: RootState) => state.orders.errors;

export default ordersSlice.reducer;
