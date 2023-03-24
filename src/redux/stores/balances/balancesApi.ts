import BalanceChecker from '@airswap/balances/build/contracts/BalanceChecker.json';
// eslint-disable-next-line import/extensions
import balancesDeploys from '@airswap/balances/deploys.js';
import { tokenKinds } from '@airswap/constants';
import { SwapERC20, Wrapper } from '@airswap/libraries';
import { abi as ERC165_ABI } from '@openzeppelin/contracts/build/contracts/ERC165.json';
import { abi as ERC721_ABI } from '@openzeppelin/contracts/build/contracts/ERC721.json';
// eslint-disable-next-line camelcase
import { abi as ERC721Enumerable_ABI } from '@openzeppelin/contracts/build/contracts/ERC721Enumerable.json';
import { abi as ERC1155_ABI } from '@openzeppelin/contracts/build/contracts/ERC1155.json';
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

interface fetchTokenIdsParams {
  provider: ethers.providers.Web3Provider;
  walletAddress: string;
  collectionTokenAddress: string;
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

export const fetchTokenIds = createAsyncThunk<number[], fetchTokenIdsParams>(
  'balances/fetchTokenIds',
  async ({
    provider,
    walletAddress,
    collectionTokenAddress,
  }) => {
    // 0x780e9d63 is the interface ID for erc721 enumerable
    const ERC721Enumerable = '0x780e9d63';

    const contract = new ethers.Contract(collectionTokenAddress, ERC165_ABI, provider);

    const isERC721Enumerable = await contract.supportsInterface(ERC721Enumerable);
    if (isERC721Enumerable) {
      const collectionContract = new ethers.Contract(collectionTokenAddress, ERC721Enumerable_ABI, provider);

      const balance: number = await collectionContract.balanceOf(walletAddress);
      const indexes = Array.from({ length: balance }, (_, i) => i);

      const tokenIdsPromises = indexes.map(async index => (await collectionContract.tokenOfOwnerByIndex(walletAddress, BigNumber.from(index))) as BigNumber);
      const tokenIds = await Promise.all(tokenIdsPromises);

      return tokenIds.map(t => t.toNumber());
    }

    const isERC721 = await contract.supportsInterface(tokenKinds.ERC721);
    if (isERC721) {
      const collectionContract = new ethers.Contract(collectionTokenAddress, ERC721_ABI, provider);
      const transferFilter = collectionContract.filters.Transfer(null, walletAddress);

      const events = await collectionContract.queryFilter(transferFilter, 0);
      /* get token ids from past events */
      const foundTokenIds: BigNumber[] = events.map(e => e.args?.at(2));

      /* get unique values */
      const uniqueTokenIds = foundTokenIds.filter((element, index) => foundTokenIds.indexOf(element) === index);

      const ownedTokenIds = uniqueTokenIds.filter(async id => {
        const addr = await collectionContract.ownerOf(id);

        if (addr === walletAddress) return true;

        return false;
      });

      const tokenIds = ownedTokenIds.map(t => t.toNumber());

      return tokenIds;
    }

    const isERC1155 = await contract.supportsInterface(tokenKinds.ERC1155);
    if (isERC1155) {
      const collectionContract = new ethers.Contract(collectionTokenAddress, ERC1155_ABI, provider);
      const transferFilter = collectionContract.filters.TransferSingle(null, null, walletAddress);

      const events = await collectionContract.queryFilter(transferFilter, 0);
      /* get token ids from past events */
      const tokenIds: number[] = events.map(e => e.args?.at(3).toNumber());

      /* get unique values */
      const uniqueTokenIds = tokenIds.filter((element, index) => tokenIds.indexOf(element) === index);

      /* TODO uniqueTokenIds should not be any[] */
      return uniqueTokenIds;
    }

    throw new Error('Unknown nft interface. Could not fetch token ids.');
  },
);
