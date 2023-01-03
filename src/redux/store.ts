import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import web3Reducer from './stores/web3/web3Slice';

export const store = configureStore({
  reducer: {
    web3: web3Reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
