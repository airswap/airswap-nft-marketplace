import { FullOrder } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
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
    dispatch(setOrdersOffset((filter.limit || 0) + (filter.offset || 0)));

    return await getOrdersFromIndexers(filter, indexer.urls);
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
