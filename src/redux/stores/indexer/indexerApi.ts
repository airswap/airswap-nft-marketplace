import { Protocols } from '@airswap/constants';
import { Registry } from '@airswap/libraries';
import { FullOrder, IndexedOrder, RequestFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { providers } from 'ethers';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../../../constants/configParams';
import { AppDispatch, RootState } from '../../store';
import { getServers } from './indexerHelpers';

interface InitializeIndexersParams {
  chainId: number,
  provider: providers.Web3Provider,
}

export const initializeIndexers = createAsyncThunk<string[], InitializeIndexersParams>(
  'indexer/initializeIndexers',
  async ({ chainId, provider }) => {
    console.log('fetching urls');
    return Registry.getServerURLs(provider, chainId, Protocols.Indexing);
  },
);

export const getFilteredOrders = createAsyncThunk<
FullOrder[],
{ filter: RequestFilter },
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
      const orderResponse = await server.getOrdersBy(filter);
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
