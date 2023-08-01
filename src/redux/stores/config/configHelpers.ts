import erc20AbiContract from '@openzeppelin/contracts/build/contracts/ERC20.json';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { ethers } from 'ethers';

import { SupportedTokenKind } from '../../../types/SupportedTokenKind';

export const getCollectionTokenTokenKind = async (provider: ethers.providers.Web3Provider, address: string): Promise<SupportedTokenKind | undefined> => {
  const contract = new ethers.Contract(address, erc721AbiContract.abi, provider);

  const [
    isErc721Enumerable,
    isErc721,
    isErc1155,
  ] = await Promise.all([
    contract.supportsInterface(SupportedTokenKind.ERC721Enumerable),
    contract.supportsInterface(SupportedTokenKind.ERC721),
    contract.supportsInterface(SupportedTokenKind.ERC1155),
  ]) as boolean[];

  if (isErc721Enumerable) {
    return SupportedTokenKind.ERC721Enumerable;
  }

  if (isErc721) {
    return SupportedTokenKind.ERC721;
  }

  if (isErc1155) {
    return SupportedTokenKind.ERC1155;
  }

  return undefined;
};

export const getCurrencyTokenTokenKind = async (provider: ethers.providers.Web3Provider, address: string): Promise<SupportedTokenKind | undefined> => {
  const contract = new ethers.Contract(address, erc20AbiContract.abi, provider);

  const totalSupply = await contract.totalSupply();

  if (totalSupply) {
    return SupportedTokenKind.ERC20;
  }

  return undefined;
};
