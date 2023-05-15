import {
  Action,
  AnyAction,
  configureStore,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';

import balancesReducer from './stores/balances/balancesSlice';
import { configureBalancesSubscriber } from './stores/balances/balancesSubscriber';
import configReducer from './stores/config/configSlice';
import indexerReducer from './stores/indexer/indexerSlice';
import listNftReducer from './stores/listNft/listNftSlice';
import metadataReducer from './stores/metadata/metadataSlice';
import ordersReducer from './stores/orders/ordersSlice';
import toastsReducer from './stores/toasts/toastsSlice';
import transactionsReducer from './stores/transactions/transactionsSlice';
import userReducer from './stores/user/userSlice';
import { configureUserSubscriber } from './stores/user/userSubscriber';
import web3Reducer from './stores/web3/web3Slice';

export const store = configureStore({
  reducer: {
    balances: balancesReducer,
    config: configReducer,
    indexer: indexerReducer,
    listNft: listNftReducer,
    metadata: metadataReducer,
    orders: ordersReducer,
    toasts: toastsReducer,
    transactions: transactionsReducer,
    user: userReducer,
    web3: web3Reducer,
  },
});

configureBalancesSubscriber();
configureUserSubscriber();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;

