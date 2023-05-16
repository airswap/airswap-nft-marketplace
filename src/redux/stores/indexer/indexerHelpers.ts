import { Server } from '@airswap/libraries';
import { FullOrder } from '@airswap/types';

export const sendOrderToIndexers = async (
  order: FullOrder,
  servers: Server[],
) => {
  if (!servers.length) throw new Error('No indexer servers provided');

  const addOrderPromises = servers.map((server) => server
    .addOrder(order)
    .then(() => console.log(`Order added to ${server.locator}`))
    .catch((e: any) => {
      console.log(
        `[indexerSlice] Order indexing failed for ${server.locator}`,
        e.message || '',
      );
    }));

  Promise.race([
    Promise.allSettled(addOrderPromises),
    // eslint-disable-next-line no-promise-executor-return
    new Promise((res) => setTimeout(res, 4000)),
  ]);
};
