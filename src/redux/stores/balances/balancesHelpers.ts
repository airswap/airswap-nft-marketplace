import { TokenKinds } from '@airswap/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Event } from '@ethersproject/contracts';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import erc721EnumerableContract from '@openzeppelin/contracts/build/contracts/ERC721Enumerable.json';
import { BigNumber, ethers } from 'ethers';

import { TokenIdsWithBalance } from '../../../entities/TokenIdsWithBalance/TokenIdsWithBalance';
import {
  transformOwnedNftsToTokenIdsWithBalance,
  transformTokensToTokenIdsWithBalance,
} from '../../../entities/TokenIdsWithBalance/TokenIdsWithBalanceTransformers';
import { getUniqueSingleDimensionArray } from '../../../helpers/array';

const getUniqueTokenIds = (tokenIds: BigNumber[]): string[] => tokenIds
  .sort((a, b) => a.sub(b).toNumber())
  .map(t => t.toString())
  .filter(getUniqueSingleDimensionArray);

const getOwnedErc721TokensByFilteringEvents = async (
  provider: ethers.providers.BaseProvider,
  walletAddress: string,
  collectionToken: string,
): Promise<TokenIdsWithBalance> => {
  const contract = new ethers.Contract(collectionToken, erc721AbiContract.abi, provider);
  const transferFilter = contract.filters.Transfer(null, walletAddress);

  const events: Event[] = await contract.queryFilter(transferFilter, 0);

  /* get token ids from past events */
  const foundTokenIds: BigNumber[] = events.map(e => e.args?.at(2));
  const uniqueTokenIds = getUniqueTokenIds(foundTokenIds);

  /* get owners of tokens */
  const tokenOwners: string[] = await Promise.all(
    uniqueTokenIds.map(tokenId => contract.ownerOf(tokenId)),
  );

  /* get only the owned token ids */
  const ownedTokenIds = uniqueTokenIds.filter((_, index) => tokenOwners[index] === walletAddress);

  return transformTokensToTokenIdsWithBalance(ownedTokenIds);
};

const getOwnedErc721EnumerableTokensByFilteringEvents = async (
  provider: ethers.providers.BaseProvider,
  walletAddress: string,
  collectionToken: string,
): Promise<TokenIdsWithBalance> => {
  const contract = new ethers.Contract(collectionToken, erc721EnumerableContract.abi, provider);

  const balance: number = await contract.balanceOf(walletAddress);
  const indexes = Array.from({ length: balance }, (_, i) => i);

  const tokenIdsPromises = indexes.map(async index => (await contract.tokenOfOwnerByIndex(walletAddress, BigNumber.from(index))) as BigNumber);
  const tokenIds = await Promise.all(tokenIdsPromises);

  return transformTokensToTokenIdsWithBalance(tokenIds.map(tokenId => tokenId.toString()));
};

const getOwnedTokensByAlchemy = async (walletAddress: string, collectionToken: string): Promise<TokenIdsWithBalance> => {
  const response = await alchemy.nft.getNftsForOwner(walletAddress, { contractAddresses: [collectionToken], withMetadata: false });

  return transformOwnedNftsToTokenIdsWithBalance(response.ownedNfts);
};

export const getOwnedTokenIdsOfWallet = async (
  provider: ethers.providers.BaseProvider,
  walletAddress: string,
  collectionToken: string,
): Promise<TokenIdsWithBalance> => {
  const contract = new ethers.Contract(collectionToken, erc721AbiContract.abi, provider);

  const [isErc721Enumerable, isErc721, isErc1155] = await Promise.all([
    contract.supportsInterface('0x780e9d63'), // The interface ID for erc721 enumerable
    contract.supportsInterface(TokenKinds.ERC721),
    contract.supportsInterface(TokenKinds.ERC1155),
  ]) as boolean[];


  if (isErc721) {
    try {
      return await getOwnedErc721TokensByFilteringEvents(provider, walletAddress, collectionToken);
    } catch {
      return getOwnedTokensByAlchemy(walletAddress, collectionToken);
    }
  }

  if (isErc721Enumerable) {
    try {
      return await getOwnedErc721EnumerableTokensByFilteringEvents(provider, walletAddress, collectionToken);
    } catch {
      return getOwnedTokensByAlchemy(walletAddress, collectionToken);
    }
  }

  if (isErc1155) {
    return getOwnedTokensByAlchemy(walletAddress, collectionToken);
  }

  throw new Error('Unknown nft interface. Could not fetch token ids.');
};
