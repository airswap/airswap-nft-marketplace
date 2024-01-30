import { OrderERC20 } from '@airswap/utils';
import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { AppError } from '../../../errors/appError';
import { approve, take } from './ordersActions';

export interface OrdersState {
  orders: OrderERC20[];
  status: 'idle' | 'requesting' | 'approving' | 'taking' | 'failed' | 'reset';
  reRequestTimerId: number | null;
  error?: AppError;
}

const initialState: OrdersState = {
  orders: [],
  status: 'idle',
  reRequestTimerId: null,
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<AppError | undefined>) => ({
      ...state,
      error: action.payload,
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
  setError,
} = ordersSlice.actions;

export default ordersSlice.reducer;
