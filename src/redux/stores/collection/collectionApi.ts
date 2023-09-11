import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { setOffset } from './collectionSlice';

export const getCollectionOrders = createAsyncThunk<
FullOrder[],
Pick<OrderFilter, 'limit' | 'offset'>,
AppThunkApiConfig
>('collection/getCollectionOrders', async (filter, { dispatch, getState }) => {
  const { config, indexer } = getState();

  const { collectionToken, currencyToken } = config;

  dispatch(setOffset(filter.limit + filter.offset));

  try {
    return await getOrdersFromIndexers({
      ...filter,
      signerTokens: [collectionToken],
      senderTokens: [currencyToken],
    }, indexer.urls);
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
