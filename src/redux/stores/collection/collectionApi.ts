import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { setOffset } from './collectionSlice';

export const getCollectionOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
AppThunkApiConfig
>('collection/getCollectionOrders', async (filter, { dispatch, getState }) => {
  const { indexer } = getState();

  dispatch(setOffset(filter.limit + filter.offset));

  return getOrdersFromIndexers(filter, indexer.urls);
});
