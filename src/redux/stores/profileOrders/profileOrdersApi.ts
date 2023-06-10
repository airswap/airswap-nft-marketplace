import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { setOrdersOffset } from './profileOrdersSlice';

export const getProfileOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
AppThunkApiConfig
>('profileOrders/getProfileOrders', async (filter, { dispatch, getState }) => {
  const { indexer } = getState();

  dispatch(setOrdersOffset(filter.limit + filter.offset));

  return getOrdersFromIndexers(filter, indexer.urls);
});
