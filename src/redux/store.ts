import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';

import balancesReducer from './stores/balances/balancesSlice';
import { configureBalancesSubscriber } from './stores/balances/balancesSubscriber';
import collectionReducer from './stores/collection/collectionSlice';
import configReducer from './stores/config/configSlice';
import metadataReducer from './stores/metadata/metadataSlice';
import { configureMetadataSubscriber } from './stores/metadata/metadataSubscriber';
import userReducer from './stores/user/userSlice';
import { configureUserSubscriber } from './stores/user/userSubscriber';
import web3Reducer from './stores/web3/web3Slice';

export const store = configureStore({
  reducer: {
    balances: balancesReducer,
    config: configReducer,
    metadata: metadataReducer,
    web3: web3Reducer,
    user: userReducer,
    collection: collectionReducer,
  },
});

configureBalancesSubscriber();
configureMetadataSubscriber();
configureUserSubscriber();

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;

