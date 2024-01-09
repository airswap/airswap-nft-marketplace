import { SuccessResponse } from '@airswap/libraries';
import { FullOrder, IndexedOrder, OrderResponse } from '@airswap/types';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../constants/indexer';
import { OrderFilter } from '../entities/OrderFilter/OrderFilter';
import { getOrdersFromServer, getServers } from '../redux/stores/indexer/indexerHelpers';

export const isPromiseFulfilledResult = <T>(result: any): result is PromiseFulfilledResult<T> => result && result.status === 'fulfilled' && 'value' in result;

export const isOrderResponse = <T>(resource: any): resource is OrderResponse<T> => (resource && 'orders' in resource);

export const isSuccessResponse = (response: any): response is SuccessResponse => response
    && typeof response.message === 'string'
    && !('code' in response);

export const getUndefinedAfterTimeout = (time: number): Promise<undefined> => new Promise<undefined>((resolve) => {
  setTimeout(() => resolve(undefined), time);
});

export const getOrdersFromIndexers = async (filter: OrderFilter, indexerUrls: string[]): Promise<FullOrder[]> => {
  if (!indexerUrls.length) {
    console.error('[getOrdersFromIndexers] No indexer urls provided');
  }

  const servers = await getServers(indexerUrls);

  const responses = await Promise.all(
    servers.map(server => Promise.race([
      getOrdersFromServer(server, filter),
      getUndefinedAfterTimeout(INDEXER_ORDER_RESPONSE_TIME_MS),
    ])),
  );

  const orderResponses = responses.filter(isOrderResponse<FullOrder>);

  if (orderResponses.length === 0) {
    console.error('[getOrdersFromIndexers] No order responses received');

    throw new Error('No order responses received');
  }

  const indexedOrders: Record<string, IndexedOrder<FullOrder>> = orderResponses
    .reduce((total, orderResponse) => ({
      ...total,
      ...orderResponse.orders,
    }), {});

  return Object.values(indexedOrders).map(indexedOrder => indexedOrder.order);
};
