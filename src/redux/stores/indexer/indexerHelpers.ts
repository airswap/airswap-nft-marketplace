import { Server } from '@airswap/libraries';
import { FullOrder, OrderFilter, OrderResponse } from '@airswap/types';

export const isPromiseFulfilledResult = <T>(result: any): result is PromiseFulfilledResult<T> => result && result.status === 'fulfilled' && 'value' in result;

export const isOrderResponse = <T>(resource: any): resource is OrderResponse<T> => ('orders' in resource);

export const getUndefinedAfterTimeout = (time: number): Promise<undefined> => new Promise<undefined>((resolve) => {
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

export const sendOrderToIndexers = async (
  order: FullOrder,
  indexerUrls: string[],
): Promise<void> => {
  const servers = await getServers(indexerUrls);

  if (!servers.length) {
    console.error('[sendOrderToIndexers] No indexer servers provided');
  }

  servers.forEach((server) => server
    .addOrder(order)
    .catch((e: any) => {
      console.error(
        `[sendOrderToIndexers] Order indexing failed for ${server.locator}`,
        e.message || '',
      );
    }));
};
