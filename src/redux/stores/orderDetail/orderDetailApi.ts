import { FullOrder } from '@airswap/types';
import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { getOrdersFromIndexers } from '../../../helpers/indexers';
import { AppThunkApiConfig } from '../../store';
import { addGetOrderFailedToast } from '../toasts/toastsActions';

interface GetNftOrderByOrderNonceParams extends Partial<OrderFilter> {
  orderNonce: string;
  signerWallet: string;
  provider: BaseProvider;
}

export const getNftOrderByOrderNonce = createAsyncThunk<
FullOrder | undefined,
GetNftOrderByOrderNonceParams,
AppThunkApiConfig
>('orderDetail/getNftOrderByNonce', async ({ orderNonce, signerWallet, provider }, { dispatch, getState }) => {
  const { indexer } = getState();

  try {
    const orders = await getOrdersFromIndexers(
      {
        signerWallet,
        offset: 0,
        limit: 999,
      },
      indexer.urls,
      provider,
    );

    return orders.find(order => order.nonce === orderNonce);
  } catch {
    dispatch(addGetOrderFailedToast());

    return undefined;
  }
});
