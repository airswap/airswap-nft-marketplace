import BalanceChecker from '@airswap/balances/build/contracts/BalanceChecker.json';
// eslint-disable-next-line import/extensions
import balancesDeploys from '@airswap/balances/deploys.js';
import { tokenKinds } from '@airswap/constants';
import { SwapERC20, Wrapper } from '@airswap/libraries';
import erc165AbiContract from '@openzeppelin/contracts/build/contracts/ERC165.json';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import erc721EnumerableContract from '@openzeppelin/contracts/build/contracts/ERC721Enumerable.json';
import erc1155Contract from '@openzeppelin/contracts/build/contracts/ERC1155.json';
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
    collectionTokenAddress,
  }) => {
    // 0x780e9d63 is the interface ID for erc721 enumerable
    const ERC721Enumerable = '0x780e9d63';

    const tokenKind = collectionToken.extensions?.kind as TokenKinds;

    // @ts-ignore
    if (tokenKind === ERC721Enumerable) {
      const collectionContract = new ethers.Contract(collectionToken.address, erc721EnumerableContract.abi, provider);

      const balance: number = await collectionContract.balanceOf(walletAddress);
      const indexes = Array.from({ length: balance }, (_, i) => i);

      const tokenIdsPromises = indexes.map(async index => (await collectionContract.tokenOfOwnerByIndex(walletAddress, BigNumber.from(index))) as BigNumber);
      const tokenIds = await Promise.all(tokenIdsPromises);

      return tokenIds.map(t => t.toNumber());
    }

    if (tokenKind === TokenKinds.ERC721) {
      const collectionContract = new ethers.Contract(collectionToken.address, erc721AbiContract.abi, provider);
      const transferFilter = collectionContract.filters.Transfer(null, walletAddress);

      const events = await collectionContract.queryFilter(transferFilter, 0);
      /* get token ids from past events */
      const foundTokenIds: BigNumber[] = events.map(e => e.args?.at(2));

      /* get unique values */
      const uniqueTokenIds = foundTokenIds.filter((element, index) => foundTokenIds.indexOf(element) === index);

      /* Get only the owned token ids */
      const ownedTokenIds = uniqueTokenIds.filter(async id => {
        const addr = await collectionContract.ownerOf(id);

        if (addr === walletAddress) return true;

        return false;
      });

      const tokenIds = ownedTokenIds.map(t => t.toNumber());

      return tokenIds;
    }

    if (tokenKind === TokenKinds.ERC1155) {
      const collectionContract = new ethers.Contract(collectionToken.address, erc1155Contract.abi, provider);
      const transferFilter = collectionContract.filters.TransferSingle(null, null, walletAddress);

      const events = await collectionContract.queryFilter(transferFilter, 0);
      /* get token ids from past events */
      const foundTokenIds: BigNumber[] = events.map(e => e.args?.at(3));

      /* get unique values */
      const uniqueTokenIds = foundTokenIds.filter((element, index) => foundTokenIds.indexOf(element) === index);

      /* Get only the owned token ids */
      const ownedTokenIds = uniqueTokenIds.filter(async id => {
        const balance = (await collectionContract.balanceOf(walletAddress, id)).toNumber();

        if (balance !== 0) return true;

        return false;
      });

      const tokenIds = ownedTokenIds.map(t => t.toNumber());

      return tokenIds;
    }

    throw new Error('Unknown nft interface. Could not fetch token ids.');
  },
);
