import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import balancesReducer from './stores/balances/balancesSlice';
import { configureBalancesSubscriber } from './stores/balances/balancesSubscriber';
import web3Reducer from './stores/web3/web3Slice';

export const store = configureStore({
  reducer: {
    web3: web3Reducer,
    balances: balancesReducer,
  },
});

configureBalancesSubscriber();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
