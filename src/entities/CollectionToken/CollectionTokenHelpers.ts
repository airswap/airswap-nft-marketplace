import { TokenKinds } from '@airswap/constants';
import { getCollectionTokenInfo } from '@airswap/metadata';
import { CollectionTokenInfo } from '@airswap/types';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import erc721AbiEnumerableContract from '@openzeppelin/contracts/build/contracts/ERC721Enumerable.json';
import erc1155AbiContract from '@openzeppelin/contracts/build/contracts/ERC1155.json';
import * as ethers from 'ethers';

import { AppError, AppErrorType, transformToAppError } from '../../errors/appError';

const transformGetCollectionTokenErrorToAppError = (error: any): AppError => {
  if (typeof error !== 'string') {
    return transformToAppError(AppErrorType.unknownError);
  }

  if (error.includes('404')) {
    return transformToAppError(AppErrorType.notFound, undefined, error);
  }

  if (error.includes('Network Error')) {
    return transformToAppError(AppErrorType.networkError, undefined, error);
  }

  return transformToAppError(AppErrorType.unknownError);
};

export const getCollectionToken = async (library: ethers.providers.BaseProvider, address: string, tokenId: string): Promise<CollectionTokenInfo | AppError> => {
  let tokenInfo: CollectionTokenInfo;

  try {
    tokenInfo = await getCollectionTokenInfo(library, address, tokenId);
  } catch (e: any) {
    console.error(new Error(`Unable to fetch data for ${address} with id ${tokenId}. ${e}`));

    return transformGetCollectionTokenErrorToAppError(e);
  }

  return tokenInfo;
};

export const getCollectionTokenContractAbi = (kind: CollectionTokenInfo['kind']): ethers.ContractInterface => {
  if (kind === TokenKinds.ERC721) {
    return erc721AbiContract.abi;
  }

  if (kind === TokenKinds.ERC1155) {
    return erc1155AbiContract.abi;
  }

  return erc721AbiEnumerableContract.abi;
};

export const getCollectionTokenOwner = async (library: ethers.providers.BaseProvider, token: CollectionTokenInfo): Promise<string | undefined> => {
  const contractAbi = getCollectionTokenContractAbi(token.kind);
  const contract = new ethers.Contract(token.address, contractAbi, library);

  if (token.kind === TokenKinds.ERC1155) {
    // TODO: Use NftTransactionLogs to determine the people who owns this token (can be multiple owners)
    // https://github.com/orgs/airswap/projects/9/views/1?pane=issue&itemId=26957049

    // Maybe use this or derive it all from logs:
    // balanceOf(address account, uint256 id) → uint256
    // Returns the amount of tokens of token type id owned by account.
    return undefined;
  }

  return contract.functions.ownerOf(token.id)
    .then((owner: [string]) => owner[0])
    .catch(() => undefined);
};

export const isCollectionTokenInfo = (resource: any): resource is CollectionTokenInfo => (
  resource
    && typeof resource.chainId === 'number'
    && typeof resource.kind === 'string'
    && typeof resource.address === 'string'
    && typeof resource.id === 'number'
    && typeof resource.uri === 'string'
    && resource.attributes && Array.isArray(resource.attributes)
);

export const filterCollectionTokenBySearchValue = (token: CollectionTokenInfo, value: string): boolean => {
  if (value === '') return true;

  if (token.name && token.name.toLowerCase().includes(value.toLowerCase())) return true;

  return token.id.toString().toLowerCase().includes(value.toLowerCase());
};
