import { FullOrder } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { setOffset } from './collectionSlice';

export const getCollectionOrders = createAsyncThunk<
FullOrder[],
{ limit: number; offset: number },
AppThunkApiConfig
>('collection/getCollectionOrders', async (filter, { dispatch, getState }) => {
  const { config, indexer } = getState();

  const { collectionToken, currencyToken } = config;
  // const { transactions } = transactionsState;
  // const orderTransactions = transactions.filter(isOrderTransaction);
  // const cancelTransactions = transactions.filter(isCancelOrderTransaction);
  // const excludeNonces = [...orderTransactions, ...cancelTransactions].map(transaction => transaction.order.nonce);

  dispatch(setOffset(filter.limit + filter.offset));

  try {
    return await getOrdersFromIndexers({
      ...filter,
      signerToken: collectionToken,
      senderToken: currencyToken,
    }, indexer.urls);
  } catch {
    dispatch(addGetOrderFailedToast());

    throw new Error('Failed to get orders');
  }
});
