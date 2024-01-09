import { Server, SuccessResponse } from '@airswap/libraries';
import { FullOrder, OrderResponse } from '@airswap/types';
import { SortField, SortOrder } from '@airswap/types/build/src/server';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../../../constants/indexer';
import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { getUndefinedAfterTimeout, isPromiseFulfilledResult, isSuccessResponse } from '../../../helpers/indexers';

export const getOrdersFromServer = async (server: Server, filter: OrderFilter): Promise<OrderResponse<FullOrder> | undefined> => {
  const defaultFilter: Partial<OrderFilter> = {
    sortField: SortField.NONCE,
    sortOrder: SortOrder.DESC,
  };

  const filterWithDefaults: OrderFilter = {
    ...defaultFilter,
    ...filter,
  };

  try {
    return await server.getOrders(
      filterWithDefaults,
      filterWithDefaults.offset || 0,
      filterWithDefaults.limit || 9999,
      filterWithDefaults.sortField,
      filterWithDefaults.sortOrder,
    );
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

