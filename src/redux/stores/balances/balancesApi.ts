import BalanceChecker from '@airswap/balances/build/contracts/BalanceChecker.sol/BalanceChecker.json';
// @ts-ignore
import balancesDeploys from '@airswap/balances/deploys';
import { Swap } from '@airswap/libraries';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers, providers } from 'ethers';

import { TokenIdsWithBalance } from '../../../entities/TokenIdsWithBalance/TokenIdsWithBalance';
import { getErc20TokenAllowance } from '../orders/ordersApi';
import { getOwnedTokenIdsOfWallet } from './balancesHelpers';

const balancesInterface = new ethers.utils.Interface(
  JSON.stringify(BalanceChecker.abi),
);

const getBalancesContract = (
  chainId: keyof typeof balancesDeploys,
  provider: ethers.providers.Web3Provider,
) => new ethers.Contract(
  balancesDeploys[chainId],
  balancesInterface,
  provider as providers.Provider,
);

interface WalletParams {
  chainId: number;
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  collectionTokenAddress: string;
}

export const fetchCurrencyTokenBalance = createAsyncThunk<string, WalletParams>(
  'balances/fetchBalances',
  async (params) => {
    const contract = getBalancesContract(params.chainId, params.provider);

    const response = await contract.walletBalances(params.walletAddress, [params.collectionTokenAddress]);

    return response.toString();
  },
);

export const fetchCurrencyTokenAllowance = createAsyncThunk<string, WalletParams>(
  'balances/fetchAllowances',
  async (params) => {
    const response = await getErc20TokenAllowance(
      params.collectionTokenAddress,
      params.walletAddress,
      Swap.getAddress(params.chainId) || '',
      params.provider,
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
