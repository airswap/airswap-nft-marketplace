import { Protocols } from '@airswap/constants';
import { RegistryV4 } from '@airswap/libraries';
import { FullOrder, IndexedOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { providers } from 'ethers';

import { AppDispatch, RootState } from '../../store';
import {
  getOrdersFromServer,
  getServers,
  isOrderResponse,
} from './indexerHelpers';

interface InitializeParams {
  chainId: number,
  provider: providers.Web3Provider,
}

export const initialize = createAsyncThunk<string[], InitializeParams>(
  'indexer/initialize',
  async ({ chainId, provider }) => RegistryV4.getServerURLs(
    provider,
    chainId,
    Protocols.Storage,
  ),
);

export const getFilteredOrders = createAsyncThunk<
FullOrder[],
{ filter: OrderFilter },
{
  dispatch: AppDispatch;
  state: RootState;
}
>('indexer/getFilteredOrders', async ({ filter }, { getState }) => {
  const { indexer } = getState();

  if (!indexer.isInitialized) return [];

  const servers = await getServers(indexer.urls);

  const orderResponses = await Promise.all(servers.map(server => getOrdersFromServer(server, filter)));

  const indexedOrders: Record<string, IndexedOrder<FullOrder>> = orderResponses
    .filter(isOrderResponse<FullOrder>)
    .reduce((total, orderResponse) => ({
      ...total,
      ...orderResponse.orders,
    }), {});

  return Object.values(indexedOrders).map(indexedOrder => indexedOrder.order);
});
