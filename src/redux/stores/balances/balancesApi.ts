import BalanceChecker from '@airswap/balances/build/contracts/BalanceChecker.json';
// eslint-disable-next-line import/extensions
import balancesDeploys from '@airswap/balances/deploys.js';
import { SwapERC20, Wrapper } from '@airswap/libraries';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, ethers, providers } from 'ethers';

const balancesInterface = new ethers.utils.Interface(
  JSON.stringify(BalanceChecker.abi),
);

const getContract = (
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
  tokenAddresses: string[];
}

/**
 * Fetches balances or allowances for a wallet using the airswap utility
 * contract `BalanceChecker.sol`. Balances are returned in base units.
 */

const fetchBalancesOrAllowances: (
  method: 'walletBalances' | 'walletAllowances',
  spenderAddressType: 'wrapper' | 'swap' | 'none',
  params: WalletParams
) => Promise<BigNumber[]> = async (
  method,
  spenderAddressType,
  {
    chainId,
    provider,
    tokenAddresses,
    walletAddress,
  },
) => {
  const contract = getContract(chainId, provider);

  let args = [walletAddress, tokenAddresses];

  if (spenderAddressType === 'swap') {
    args = [walletAddress, SwapERC20.getAddress(chainId), tokenAddresses];
  }

  if (spenderAddressType === 'wrapper') {
    args = [walletAddress, Wrapper.getAddress(chainId), tokenAddresses];
  }

  const amounts: BigNumber[] = await contract[method].apply(null, args);

  return amounts.map((amount) => amount);
};

export const fetchBalances = createAsyncThunk<{ [address: string]: string }, WalletParams>(
  'balances/fetchBalances',
  async (params) => {
    const responses = await fetchBalancesOrAllowances('walletBalances', 'none', params);
    const bigNumbers = responses.map(bigNumber => bigNumber.toString());

    return params.tokenAddresses.reduce((total, token, index) => ({
      ...total,
      [token]: bigNumbers[index],
    }), {});
  },
);
