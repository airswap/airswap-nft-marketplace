import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';

export const getProfileOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
{
  dispatch: AppDispatch;
  state: RootState;
}
>('profile/getProfileOrders', async (filter, { getState }) => {
  const { indexer } = getState();

  return getOrdersFromIndexers(filter, indexer.urls);
});
