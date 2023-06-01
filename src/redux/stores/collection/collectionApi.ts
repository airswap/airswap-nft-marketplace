import { FullOrder, IndexedOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../../../constants/indexer';
import { AppDispatch, RootState } from '../../store';
import {
  getOrdersFromServer, getServers, getUndefinedAfterTimeout, isOrderResponse,
} from '../indexer/indexerHelpers';
import { setOffset } from './collectionSlice';


export const getFilteredOrders = createAsyncThunk<
FullOrder[],
{ filter: OrderFilter },
{
  dispatch: AppDispatch;
  state: RootState;
}
>('indexer/getFilteredOrders', async ({ filter }, { dispatch, getState }) => {
  const { indexer } = getState();

  dispatch(setOffset(filter.limit + filter.offset));

  const servers = await getServers(indexer.urls);

  const orderResponses = await Promise.all(
    servers.map(server => Promise.race([
      getOrdersFromServer(server, filter),
      getUndefinedAfterTimeout(INDEXER_ORDER_RESPONSE_TIME_MS),
    ])),
  );

  const indexedOrders: Record<string, IndexedOrder<FullOrder>> = orderResponses
    .filter(isOrderResponse<FullOrder>)
    .reduce((total, orderResponse) => ({
      ...total,
      ...orderResponse.orders,
    }), {});

  return Object.values(indexedOrders).map(indexedOrder => indexedOrder.order);
});
