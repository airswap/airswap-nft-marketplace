import { BatchCall, Swap } from '@airswap/libraries';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { TokenIdsWithBalance } from '../../../entities/TokenIdsWithBalance/TokenIdsWithBalance';
import { getOwnedTokenIdsOfWallet } from './balancesHelpers';

interface WalletParams {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  collectionTokenAddress: string;
}

export const fetchCurrencyTokenBalance = createAsyncThunk<string, WalletParams>(
  'balances/fetchBalances',
  async (params) => {
    const contract = BatchCall.getContract(params.provider, params.chainId);

    const response = await contract.walletBalances(params.walletAddress, [params.collectionTokenAddress]);

    return response.toString();
  },
);

export const fetchCurrencyTokenAllowance = createAsyncThunk<string, WalletParams>(
  'balances/fetchAllowances',
  async (params) => {
    const contract = BatchCall.getContract(params.provider, params.chainId);

    const response = await contract.tokenAllowance(
      params.walletAddress,
      Swap.getAddress(params.chainId) || '',
      params.collectionTokenAddress,
    );

    return response.toString();
  },
);

interface fetchTokenIdsParams {
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  collectionToken: string;
}

export const fetchUserTokens = createAsyncThunk<TokenIdsWithBalance, fetchTokenIdsParams>(
  'balances/fetchUserTokens',
  async ({
    provider,
    walletAddress,
    collectionToken,
  }) => getOwnedTokenIdsOfWallet(provider, walletAddress, collectionToken),
);
