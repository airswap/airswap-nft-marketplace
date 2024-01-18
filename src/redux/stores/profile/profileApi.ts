import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { ExtendedFullOrder } from '../../../entities/FullOrder/FullOrder';
import { OrderFilter } from '../../../entities/OrderFilter/OrderFilter';
import { TokenIdsWithBalance } from '../../../entities/TokenIdsWithBalance/TokenIdsWithBalance';
import { getOrdersFromIndexers } from '../../../helpers/indexers';
import { FullOrderState } from '../../../types/FullOrderState';
import { AppThunkApiConfig } from '../../store';
import { getOwnedTokenIdsOfWallet } from '../balances/balancesHelpers';

interface GetProfileOrdersParams extends OrderFilter {
  provider: BaseProvider;
}

export const getProfileOrders = createAsyncThunk<
ExtendedFullOrder[],
GetProfileOrdersParams,
AppThunkApiConfig
>('profile/getProfileOrders', async ({ provider, ...filter }, { getState }) => {
  const { indexer } = getState();

  const orders = await getOrdersFromIndexers({
    ...filter,
    offset: 0,
    limit: 9999,
  }, indexer.urls, provider);

  return orders.filter((order) => order.state === FullOrderState.open);
});

interface GetOwnedTokensOfAccountParams {
  account: string,
  provider: ethers.providers.BaseProvider,
}

export const getProfileTokens = createAsyncThunk<
TokenIdsWithBalance,
GetOwnedTokensOfAccountParams,
AppThunkApiConfig
>('profile/getProfileTokens', async ({ account, provider }, { getState }) => {
  const { config } = getState();

  return getOwnedTokenIdsOfWallet(provider, account, config.collectionToken);
});
