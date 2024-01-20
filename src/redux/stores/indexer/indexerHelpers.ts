import { Server } from '@airswap/libraries';
import {
  Direction,
  FullOrder,
  Indexes,
  OrderResponse,
} from '@airswap/types';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../../../constants/indexer';
import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { getUndefinedAfterTimeout, isPromiseFulfilledResult } from '../../../helpers/indexers';

export const getOrdersFromServer = async (server: Server, filter: OrderFilter): Promise<OrderResponse<FullOrder> | undefined> => {
  const defaultFilter: Partial<OrderFilter> = {
    chainId: +(process.env.REACT_APP_CHAIN_ID || '1'),
    signerToken: process.env.REACT_APP_COLLECTION_TOKEN,
    senderToken: process.env.REACT_APP_CURRENCY_TOKEN,
    sortField: Indexes.NONCE,
    sortOrder: Direction.DESC,
  };

  const filterWithDefaults: OrderFilter = {
    ...defaultFilter,
    ...filter,
  };

  try {
    // @ts-ignore
    return await server.getOrders(
      filterWithDefaults,
      filterWithDefaults.offset || 0,
      filterWithDefaults.limit || 9999,
      // @ts-ignore
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

const addOrderHelper = (server: Server, order: FullOrder): Promise<boolean> => new Promise((resolve, reject) => {
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
): Promise<boolean | undefined> => {
  const servers = await getServers(indexerUrls);

  if (!servers.length) {
    console.error('[sendOrderToIndexers] No indexer servers provided');
  }

  return Promise.any([
    ...servers.map(server => addOrderHelper(server, order)),
    getUndefinedAfterTimeout(INDEXER_ORDER_RESPONSE_TIME_MS),
  ]);
};

