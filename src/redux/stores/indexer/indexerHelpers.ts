import { Server, SuccessResponse } from '@airswap/libraries';
import {
  FullOrder,
  IndexedOrder,
  OrderFilter,
  OrderResponse,
} from '@airswap/types';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../../../constants/indexer';

const isPromiseFulfilledResult = <T>(result: any): result is PromiseFulfilledResult<T> => result && result.status === 'fulfilled' && 'value' in result;

const isOrderResponse = <T>(resource: any): resource is OrderResponse<T> => ('orders' in resource);

const isSuccessResponse = (response: any): response is SuccessResponse => response
  && typeof response.message === 'string'
  && !('code' in response);

const getUndefinedAfterTimeout = (time: number): Promise<undefined> => new Promise<undefined>((resolve) => {
  setTimeout(() => resolve(undefined), time);
});

export const getOrdersFromServer = async (server: Server, filter: OrderFilter): Promise<OrderResponse<FullOrder> | undefined> => {
  try {
    return server.getOrders(filter);
  } catch (e: any) {
    console.error(
      `[getOrdersFromServer] Order indexing failed for ${server.locator}`,
      e.message || '',
    );

    return undefined;
  }
};

export const getServers = async (indexerUrls: string[]): Promise<Server[]> => {
  const results: PromiseSettledResult<Server>[] = await Promise.allSettled(
    indexerUrls.map((url) => Server.at(url)),
  );

  const fulfilledResults = results.filter(isPromiseFulfilledResult) as PromiseFulfilledResult<Server>[];

  return fulfilledResults.map((result) => result.value);
};

const addOrderHelper = (server: Server, order: FullOrder): Promise<SuccessResponse> => new Promise((resolve, reject) => {
  server
    .addOrder(order)
    .then((response) => {
      resolve(response);
    })
    .catch((e) => {
      console.error(
        `[addOrderHelper] Order indexing failed for ${server.locator}`,
        e.message || '',
      );
      reject(e);
    });
});

export const sendOrderToIndexers = async (
  order: FullOrder,
  indexerUrls: string[],
): Promise<boolean> => {
  const servers = await getServers(indexerUrls);

  if (!servers.length) {
    console.error('[sendOrderToIndexers] No indexer servers provided');
  }

  const response = await Promise.any([
    ...servers.map(server => addOrderHelper(server, order)),
    getUndefinedAfterTimeout(INDEXER_ORDER_RESPONSE_TIME_MS),
  ]);

  return isSuccessResponse(response);
};

export const getOrdersFromIndexers = async (filter: OrderFilter, indexerUrls: string[]): Promise<FullOrder[]> => {
  if (!indexerUrls.length) {
    console.error('[getOrdersFromIndexers] No indexer urls provided');
  }

  const servers = await getServers(indexerUrls);

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
};
