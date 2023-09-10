import { FullOrder } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';

export const getNftOrderByOrderNonce = createAsyncThunk<
FullOrder | undefined,
string,
AppThunkApiConfig
>('orderDetail/getNftOrderByNonce', async (orderNonce, { dispatch, getState }) => {
  const { indexer } = getState();

  try {
    const orders = await getOrdersFromIndexers(
      {
        nonce: orderNonce,
        offset: 0,
        limit: 999,
      },
      indexer.urls,
    );

    return orders[0];
  } catch {
    dispatch(addGetOrderFailedToast());

    return undefined;
  }
});
