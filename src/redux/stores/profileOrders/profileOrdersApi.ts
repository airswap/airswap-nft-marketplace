import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { setOrdersOffset } from './profileOrdersSlice';

export const getProfileOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
AppThunkApiConfig
>('profileOrders/getProfileOrders', async (filter, { dispatch, getState }) => {
  const { indexer } = getState();

  try {
    dispatch(setOrdersOffset(filter.limit + filter.offset));

    return await getOrdersFromIndexers(filter, indexer.urls);
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
