import { FullOrder, OrderResponse } from '@airswap/utils';
import { BaseProvider } from '@ethersproject/providers';

import { INDEXER_ORDER_RESPONSE_TIME_MS } from '../constants/indexer';
import { ExtendedFullOrder } from '../entities/FullOrder/FullOrder';
import { getFullOrdersIsValid, getFullOrdersNonceUsed } from '../entities/FullOrder/FullOrderHelpers';
import { transformToExtendedFullOrder } from '../entities/FullOrder/FullOrderTransformers';
import { OrderFilter } from '../entities/OrderFilter/OrderFilter';
import { getOrdersFromServer, getServers } from '../redux/stores/indexer/indexerHelpers';
import { getUniqueArrayChildren } from './array';

export const isPromiseFulfilledResult = <T>(result: any): result is PromiseFulfilledResult<T> => result && result.status === 'fulfilled' && 'value' in result;

export const isOrderResponse = <T>(resource: any): resource is OrderResponse<T> => (resource && 'orders' in resource);

export const getUndefinedAfterTimeout = (time: number): Promise<undefined> => new Promise<undefined>((resolve) => {
  setTimeout(() => resolve(undefined), time);
});

export const getOrdersFromIndexers = async (
  filter: OrderFilter,
  indexerUrls: string[],
  provider: BaseProvider,
  isDemoAccount?: boolean,
): Promise<ExtendedFullOrder[]> => {
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
  const allOrders = orderResponses
    .flatMap(orderResponse => orderResponse.orders);
  const uniqueOrders: FullOrder[] = getUniqueArrayChildren<FullOrder>(allOrders, 'nonce');

  const noncesUsed = await getFullOrdersNonceUsed(uniqueOrders, provider);
  const validOrders = await getFullOrdersIsValid(uniqueOrders, provider);

  return uniqueOrders.map((fullOrder, index) => (
    transformToExtendedFullOrder(fullOrder, noncesUsed[index], isDemoAccount || validOrders[index])
  ));
};
