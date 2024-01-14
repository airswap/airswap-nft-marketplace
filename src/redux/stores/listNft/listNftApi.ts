import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ExtendedFullOrder } from '../../../entities/FullOrder/FullOrder';
import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { getOrdersFromIndexers } from '../../../helpers/indexers';
import { FullOrderState } from '../../../types/FullOrderState';
import { AppThunkApiConfig } from '../../store';
import { addGetOrderFailedToast } from '../toasts/toastsActions';

interface GetUserOrderParams extends OrderFilter {
  provider: BaseProvider;
}

export const getActiveUserOrders = createAsyncThunk<
ExtendedFullOrder[],
GetUserOrderParams,
AppThunkApiConfig
>('listNft/getActiveUserOrders', async ({ provider, ...filter }, { dispatch, getState }) => {
  const { indexer } = getState();

  try {
    const orders = await getOrdersFromIndexers({
      ...filter,
      limit: 9999,
      offset: 0,
    }, indexer.urls, provider);

    return orders.filter(order => order.state === FullOrderState.open);
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
