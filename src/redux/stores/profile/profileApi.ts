import { FullOrder, OrderFilter } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { AppThunkApiConfig } from '../../store';
import { getOwnedTokenIdsOfWallet } from '../balances/balancesHelpers';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';

export const getProfileOrders = createAsyncThunk<
FullOrder[],
OrderFilter,
AppThunkApiConfig
>('profile/getProfileOrders', async (filter, { getState }) => {
  const { indexer } = getState();

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
