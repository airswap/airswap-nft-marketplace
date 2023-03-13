import {
  Action,
  AnyAction,
  configureStore,
  ThunkAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';

import balancesReducer from './stores/balances/balancesSlice';
import { configureBalancesSubscriber } from './stores/balances/balancesSubscriber';
import collectionReducer from './stores/collection/collectionSlice';
import configReducer from './stores/config/configSlice';
import metadataReducer from './stores/metadata/metadataSlice';
import { configureMetadataSubscriber } from './stores/metadata/metadataSubscriber';
import nftDetailReducer from './stores/nftDetail/nftDetailSlice';
import ordersReducer from './stores/orders/ordersSlice';
import transactionsReducer from './stores/transactions/transactionsSlice';
import userReducer from './stores/user/userSlice';
import { configureUserSubscriber } from './stores/user/userSubscriber';
import web3Reducer from './stores/web3/web3Slice';

export const store = configureStore({
  reducer: {
    balances: balancesReducer,
    collection: collectionReducer,
    config: configReducer,
    metadata: metadataReducer,
    nftDetail: nftDetailReducer,
    orders: ordersReducer,
    transactions: transactionsReducer,
    user: userReducer,
    web3: web3Reducer,
  },
});

configureBalancesSubscriber();
configureMetadataSubscriber();
configureUserSubscriber();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;

