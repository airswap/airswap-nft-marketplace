import { Server } from '@airswap/libraries';
import {
  CollectionTokenInfo,
  Direction,
  FullOrder,
  Indexes,
  OrderResponse,
} from '@airswap/utils';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../../../constants/indexer';
import { transformCollectionTokenAttributeToString } from '../../../entities/CollectionTokenAttribute/CollectionTokenAttributeTransformers';
import { transformOrderFilterToAirswapOrderFilter } from '../../../entities/OrderFilter/OrderFilerTransformers';
import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { getUndefinedAfterTimeout, isPromiseFulfilledResult } from '../../../helpers/indexers';

export const getOrdersFromServer = async (server: Server, filter: OrderFilter): Promise<OrderResponse<FullOrder> | undefined> => {
  const defaultFilter: Partial<OrderFilter> = {
    chainId: +(process.env.REACT_APP_CHAIN_ID || '1'),
    signerToken: process.env.REACT_APP_COLLECTION_TOKEN,
    senderToken: process.env.REACT_APP_CURRENCY_TOKEN,
  };

  const filterWithDefaults: OrderFilter = {
    ...defaultFilter,
    ...filter,
  };

  try {
    return await server.getOrders(
      transformOrderFilterToAirswapOrderFilter(filterWithDefaults),
      filterWithDefaults.offset || 0,
      filterWithDefaults.limit || 9999,
      Indexes.NONCE,
      Direction.DESC,
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

const addOrderHelper = (server: Server, order: FullOrder, token: CollectionTokenInfo): Promise<boolean> => new Promise((resolve, reject) => {
  server
    .addOrder(order, token.attributes?.map(transformCollectionTokenAttributeToString))
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
  token: CollectionTokenInfo,
  indexerUrls: string[],
): Promise<boolean | undefined> => {
  const servers = await getServers(indexerUrls);

  if (!servers.length) {
    console.error('[sendOrderToIndexers] No indexer servers provided');
  }

  return Promise.any([
    ...servers.map(server => addOrderHelper(server, order, token)),
    getUndefinedAfterTimeout(INDEXER_ORDER_RESPONSE_TIME_MS),
  ]);
};

