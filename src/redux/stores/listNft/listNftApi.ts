import { FullOrder } from '@airswap/types';
import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { getOrdersFromIndexers } from '../../../helpers/indexers';
import { AppThunkApiConfig } from '../../store';
import { addGetOrderFailedToast } from '../toasts/toastsActions';

interface GetUserOrderParams extends OrderFilter {
  provider: BaseProvider;
}

export const getUserOrders = createAsyncThunk<
FullOrder[],
GetUserOrderParams,
AppThunkApiConfig
>('listNft/getUserOrders', async ({ provider, ...filter }, { dispatch, getState }) => {
  const { indexer } = getState();

  try {
    return await getOrdersFromIndexers(filter, indexer.urls, provider);
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
