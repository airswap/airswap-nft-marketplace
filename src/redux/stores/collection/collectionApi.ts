import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ExtendedFullOrder } from '../../../entities/FullOrder/FullOrder';
import { getOrdersFromIndexers } from '../../../helpers/indexers';
import { AppThunkApiConfig } from '../../store';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { setOffset } from './collectionSlice';

interface GetCollectionOrdersParams {
  limit: number;
  offset: number;
  provider: BaseProvider;
  tags: string[];
}

export const getCollectionOrders = createAsyncThunk<
ExtendedFullOrder[],
GetCollectionOrdersParams,
AppThunkApiConfig
>('collection/getCollectionOrders', async ({ provider, ...filter }, { dispatch, getState }) => {
  const { config, indexer } = getState();

  dispatch(setOffset(filter.limit + filter.offset));

  try {
    return await getOrdersFromIndexers(
      filter,
      indexer.urls,
      provider,
      config.isDemoAccount,
    );
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
