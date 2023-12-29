import { FullOrder } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';

export const getUserOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
AppThunkApiConfig
>('listNft/getUserOrders', async (filter, { dispatch, getState }) => {
  const { indexer } = getState();

  try {
    return await getOrdersFromIndexers(filter, indexer.urls);
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
