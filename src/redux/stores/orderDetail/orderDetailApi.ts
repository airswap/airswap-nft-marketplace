import { FullOrder } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';

export const getNftOrderByOrderNonce = createAsyncThunk<
FullOrder | undefined,
string,
AppThunkApiConfig
>('orderDetail/getNftOrderByNonce', async (orderNonce, { getState }) => {
  const { indexer } = getState();

  const orders = await getOrdersFromIndexers(
    {
      nonce: orderNonce,
      offset: 0,
      limit: 999,
    },
    indexer.urls,
  );

  return orders[0];
});
