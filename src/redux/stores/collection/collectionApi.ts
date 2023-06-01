import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { setOffset } from './collectionSlice';

export const getCollectionOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
{
  dispatch: AppDispatch;
  state: RootState;
}
>('collection/getCollectionOrders', async (filter, { dispatch, getState }) => {
  const { indexer } = getState();

  dispatch(setOffset(filter.limit + filter.offset));

  return getOrdersFromIndexers(filter, indexer.urls);
});
