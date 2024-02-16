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
import filterReducer from './stores/filters/filtersSlice';
import indexerReducer from './stores/indexer/indexerSlice';
import listNftReducer from './stores/listNft/listNftSlice';
import metadataReducer from './stores/metadata/metadataSlice';
import nftActivityReducer from './stores/nftActivity/nftActivitySlice';
import nftDetailReducer from './stores/nftDetail/nftDetailSlice';
import orderDetailReducer from './stores/orderDetail/orderDetailSlice';
import ordersReducer from './stores/orders/ordersSlice';
import ownersReducer from './stores/owners/ownersSlice';
import profileReducer from './stores/profile/profileSlice';
import profileOrdersReducer from './stores/profileOrders/profileOrdersSlice';
import toastsReducer from './stores/toasts/toastsSlice';
import transactionsReducer from './stores/transactions/transactionsSlice';
import userReducer from './stores/user/userSlice';
import { configureUserSubscriber } from './stores/user/userSubscriber';
import web3Reducer from './stores/web3/web3Slice';

export const store = configureStore({
  reducer: {
    balances: balancesReducer,
    collection: collectionReducer,
    config: configReducer,
    filters: filterReducer,
    indexer: indexerReducer,
    listNft: listNftReducer,
    metadata: metadataReducer,
    nftActivity: nftActivityReducer,
    nftDetail: nftDetailReducer,
    orders: ordersReducer,
    orderDetail: orderDetailReducer,
    owners: ownersReducer,
    profile: profileReducer,
    profileOrders: profileOrdersReducer,
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
export type AppThunkApiConfig = { dispatch: AppDispatch; state: RootState }
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;

