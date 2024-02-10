import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ExtendedFullOrder } from '../../../entities/FullOrder/FullOrder';
import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { getOrdersFromIndexers } from '../../../helpers/indexers';
import { AppThunkApiConfig } from '../../store';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { setOrdersOffset } from './profileOrdersSlice';

interface GetProfileOrdersParams extends OrderFilter {
  provider: BaseProvider;
}

export const getProfileOrders = createAsyncThunk<
ExtendedFullOrder[],
GetProfileOrdersParams,
AppThunkApiConfig
>('profileOrders/getProfileOrders', async ({ provider, ...filter }, { dispatch, getState }) => {
  const { config, indexer } = getState();

  try {
    dispatch(setOrdersOffset((filter.limit || 0) + (filter.offset || 0)));

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
