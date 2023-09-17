import { TokenKinds } from '@airswap/constants';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Event } from '@ethersproject/contracts';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import erc721EnumerableContract from '@openzeppelin/contracts/build/contracts/ERC721Enumerable.json';
import erc1155Contract from '@openzeppelin/contracts/build/contracts/ERC1155.json';
import { BigNumber, ethers } from 'ethers';

import { getUniqueSingleDimensionArray } from '../../../helpers/array';

const getUniqueTokenIds = (tokenIds: BigNumber[]): string[] => tokenIds
  .sort((a, b) => a.sub(b).toNumber())
  .map(t => t.toString())
  .filter(getUniqueSingleDimensionArray);

export const getOwnedTokenIdsOfWallet = async (
  provider: ethers.providers.Web3Provider,
  walletAddress: string,
  collectionToken: string,
): Promise<string[]> => {
  const contract = new ethers.Contract(collectionToken, erc721AbiContract.abi, provider);

  const [isErc721Enumerable, isErc721, isErc1155] = await Promise.all([
    contract.supportsInterface('0x780e9d63'), // The interface ID for erc721 enumerable
    contract.supportsInterface(TokenKinds.ERC721),
    contract.supportsInterface(TokenKinds.ERC1155),
  ]) as boolean[];

  if (isErc721Enumerable) {
    const collectionContract = new ethers.Contract(collectionToken, erc721EnumerableContract.abi, provider);

    const balance: number = await collectionContract.balanceOf(walletAddress);
    const indexes = Array.from({ length: balance }, (_, i) => i);

    const tokenIdsPromises = indexes.map(async index => (await collectionContract.tokenOfOwnerByIndex(walletAddress, BigNumber.from(index))) as BigNumber);
    const tokenIds = await Promise.all(tokenIdsPromises);

    return getUniqueTokenIds(tokenIds);
  }

  if (isErc721) {
    const collectionContract = new ethers.Contract(collectionToken, erc721AbiContract.abi, provider);
    const transferFilter = collectionContract.filters.Transfer(null, walletAddress);

    const events: Event[] = await collectionContract.queryFilter(transferFilter, 0);

    /* get token ids from past events */
    const foundTokenIds: BigNumber[] = events.map(e => e.args?.at(2));
    const uniqueTokenIds = getUniqueTokenIds(foundTokenIds);

    /* get owners of tokens */
    const tokenOwners: string[] = await Promise.all(
      uniqueTokenIds.map(tokenId => collectionContract.ownerOf(tokenId)),
    );

    /* get only the owned token ids */
    const ownedTokenIds = uniqueTokenIds.filter((_, index) => tokenOwners[index] === walletAddress);

    /* return sorted array of numbers */
    return ownedTokenIds.sort((a, b) => +a - +b);
  }

  if (isErc1155) {
    const collectionContract = new ethers.Contract(collectionToken, erc1155Contract.abi, provider);
    const transferFilter = collectionContract.filters.TransferSingle(null, null, walletAddress);

    const events: Event[] = await collectionContract.queryFilter(transferFilter, 0);

    /* get token ids from past events */
    const foundTokenIds: BigNumber[] = events.map(e => e.args?.at(3));

    const uniqueTokenIds = getUniqueTokenIds(foundTokenIds);

    /* get balances of tokens */
    const tokenBalances: BigNumber[] = await Promise.all(
      uniqueTokenIds.map(
        async tokenId => collectionContract.balanceOf(walletAddress, tokenId),
      ),
    );

    /* get only the owned token ids */
    const ownedTokenIds = uniqueTokenIds.filter((_, index) => tokenBalances[index].toNumber() > 0);

    /* return sorted array of numbers */
    return ownedTokenIds.sort((a, b) => +a - +b);
  }

  throw new Error('Unknown nft interface. Could not fetch token ids.');
};
