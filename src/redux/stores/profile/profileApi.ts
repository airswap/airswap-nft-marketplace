import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { AppThunkApiConfig } from '../../store';
import { getOwnedTokenIdsOfWallet } from '../balances/balancesHelpers';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { setOrdersOffset } from './profileSlice';

export const getProfileOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
AppThunkApiConfig
>('profile/getProfileOrders', async (filter, { dispatch, getState }) => {
  const { indexer } = getState();

  dispatch(setOrdersOffset(filter.limit + filter.offset));

  return getOrdersFromIndexers(filter, indexer.urls);
});

interface GetOwnedTokensOfAccountParams {
  account: string,
  provider: ethers.providers.Web3Provider,
}

export const getProfileTokens = createAsyncThunk<
number[],
GetOwnedTokensOfAccountParams,
AppThunkApiConfig
>('profile/getProfileTokens', async ({ account, provider }, { getState }) => {
  const { config } = getState();

  return getOwnedTokenIdsOfWallet(provider, account, config.collectionToken);
});
