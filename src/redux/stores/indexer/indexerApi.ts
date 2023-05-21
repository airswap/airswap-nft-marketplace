import { Protocols } from '@airswap/constants';
import { RegistryV4 } from '@airswap/libraries';
import { FullOrder, IndexedOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { providers } from 'ethers';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../../../constants/configParams';
import { AppDispatch, RootState } from '../../store';
import { getServers } from './indexerHelpers';

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
  const { indexer: indexerState } = getState();
  let orders: Record<string, IndexedOrder<FullOrder>> = {};
  if (!indexerState.isInitialized) return [];

  const servers = await getServers(indexerState.urls);

  const orderPromises = servers.map(async (server) => {
    try {
      const orderResponse = await server.getOrders(filter);
      const ordersToAdd = orderResponse.orders;
      orders = { ...orders, ...ordersToAdd };
    } catch (e: any) {
      console.error(
        `[indexerSlice] Order indexing failed for ${server.locator}`,
        e.message || '',
      );
    }
  });

  await Promise.race([
    orderPromises && Promise.allSettled(orderPromises),
    // eslint-disable-next-line no-promise-executor-return
    new Promise((res) => setTimeout(res, INDEXER_ORDER_RESPONSE_TIME_MS)),
  ]);

  return Object.entries(orders).map(([, order]) => order.order);
});