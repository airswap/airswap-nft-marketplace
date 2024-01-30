import { TokenKinds } from '@airswap/utils';
import erc20AbiContract from '@openzeppelin/contracts/build/contracts/ERC20.json';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { ethers } from 'ethers';

export const getCollectionTokenKindHelper = async (provider: ethers.providers.Web3Provider, address: string): Promise<TokenKinds | undefined> => {
  const contract = new ethers.Contract(address, erc721AbiContract.abi, provider);

  const [isErc721, isErc1155] = await Promise.all([
    contract.supportsInterface(TokenKinds.ERC721),
    contract.supportsInterface(TokenKinds.ERC1155),
  ]) as boolean[];

  if (isErc721) {
    return TokenKinds.ERC721;
  }

  if (isErc1155) {
    return TokenKinds.ERC1155;
  }

  return undefined;
};

export const getCurrencyTokenKindHelper = async (provider: ethers.providers.Web3Provider, address: string): Promise<TokenKinds | undefined> => {
  const contract = new ethers.Contract(address, erc20AbiContract.abi, provider);

  const totalSupply = await contract.totalSupply();

  if (totalSupply) {
    return TokenKinds.ERC20;
  }

  return undefined;
};
