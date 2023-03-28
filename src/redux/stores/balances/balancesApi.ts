import BalanceChecker from '@airswap/balances/build/contracts/BalanceChecker.json';
// eslint-disable-next-line import/extensions
import balancesDeploys from '@airswap/balances/deploys.js';
import { tokenKinds } from '@airswap/constants';
import { SwapERC20, Wrapper } from '@airswap/libraries';
import { TokenInfo } from '@airswap/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Event } from '@ethersproject/contracts';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import erc721EnumerableContract from '@openzeppelin/contracts/build/contracts/ERC721Enumerable.json';
import erc1155Contract from '@openzeppelin/contracts/build/contracts/ERC1155.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, ethers, providers } from 'ethers';

import { getUniqueTokensForWallet } from './balancesHelpers';

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

export const fetchAllowances = createAsyncThunk<{ [address: string]: string }, WalletParams>(
  'balances/fetchAllowances',
  async (params) => {
    const responses = await fetchBalancesOrAllowances('walletAllowances', 'swap', params);
    const bigNumbers = responses.map(bigNumber => bigNumber.toString());

    return params.tokenAddresses.reduce((total, token, index) => ({
      ...total,
      [token]: bigNumbers[index],
    }), {});
  },
);

export const getTransactionsLocalStorageKey: (
  walletAddress: string,
  chainId: number
) => string = (walletAddress, chainId) => `airswap-marketplace/transactions/${walletAddress}/${chainId}`;

interface fetchTokenIdsParams {
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  collectionToken: TokenInfo;
}

export const fetchTokenIds = createAsyncThunk<number[], fetchTokenIdsParams>(
  'balances/fetchTokenIds',
  async ({
    provider,
    walletAddress,
    collectionToken,
  }) => {
    const contract = new ethers.Contract(collectionToken.address, erc721AbiContract.abi, provider);

    const [isErc721Enumerable, isErc721, isErc1155] = await Promise.all([
      contract.supportsInterface('0x780e9d63'), // The interface ID for erc721 enumerable
      contract.supportsInterface(tokenKinds.ERC721),
      contract.supportsInterface(tokenKinds.ERC1155),
    ]) as boolean[];

    if (isErc721Enumerable) {
      const collectionContract = new ethers.Contract(collectionToken.address, erc721EnumerableContract.abi, provider);

      const balance: number = await collectionContract.balanceOf(walletAddress);
      const indexes = Array.from({ length: balance }, (_, i) => i);

      const tokenIdsPromises = indexes.map(async index => (await collectionContract.tokenOfOwnerByIndex(walletAddress, BigNumber.from(index))) as BigNumber);
      const tokenIds = await Promise.all(tokenIdsPromises);

      return tokenIds
        .map(t => t.toNumber())
        .sort((a, b) => a - b);
    }

    if (isErc721) {
      const collectionContract = new ethers.Contract(collectionToken.address, erc721AbiContract.abi, provider);
      const transferFilter = collectionContract.filters.Transfer(null, walletAddress);

      const events: Event[] = await collectionContract.queryFilter(transferFilter, 0);
      /* get token ids from past events */
      const foundTokenIds: BigNumber[] = events.map(e => e.args?.at(2));

      return getUniqueTokensForWallet(foundTokenIds, collectionContract, walletAddress);
    }

    if (isErc1155) {
      const collectionContract = new ethers.Contract(collectionToken.address, erc1155Contract.abi, provider);
      const transferFilter = collectionContract.filters.TransferSingle(null, null, walletAddress);

      const events: Event[] = await collectionContract.queryFilter(transferFilter, 0);
      /* get token ids from past events */
      const foundTokenIds: BigNumber[] = events.map(e => e.args?.at(3));

      return getUniqueTokensForWallet(foundTokenIds, collectionContract, walletAddress);
    }

    throw new Error('Unknown nft interface. Could not fetch token ids.');
  },
);
