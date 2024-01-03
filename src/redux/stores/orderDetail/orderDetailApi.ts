import { FullOrder } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';

interface GetNftOrderByOrderNonceParams extends Partial<OrderFilter> {
  orderNonce: string;
  signerWallet: string;
}

export const getNftOrderByOrderNonce = createAsyncThunk<
FullOrder | undefined,
GetNftOrderByOrderNonceParams,
AppThunkApiConfig
>('orderDetail/getNftOrderByNonce', async ({ orderNonce, signerWallet }, { dispatch, getState }) => {
  const { config, indexer } = getState();

  try {
    const orders = await getOrdersFromIndexers(
      {
        signerWallet,
        signerToken: config.collectionToken,
        offset: 0,
        limit: 999,
      },
      indexer.urls,
    );

    return orders.find(order => order.nonce === orderNonce);
  } catch {
    dispatch(addGetOrderFailedToast());

    return undefined;
  }
});
