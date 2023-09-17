import { TokenKinds } from '@airswap/constants';
import { Swap } from '@airswap/libraries';
import { FullOrder, TokenInfo } from '@airswap/types';
import { checkResultToErrors } from '@airswap/utils';
import erc20Contract from '@openzeppelin/contracts/build/contracts/ERC20.json';
import erc721Contract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import erc1155Contract from '@openzeppelin/contracts/build/contracts/ERC1155.json';
import {
  constants,
  ContractTransaction,
  ethers,
  Transaction,
} from 'ethers';

import { AppError } from '../../../errors/appError';
import { SwapError, transformSwapErrorToAppError } from '../../../errors/swapError';
import transformUnknownErrorToAppError from '../../../errors/transformUnknownErrorToAppError';

const erc20Interface = new ethers.utils.Interface(erc20Contract.abi);
const erc721Interface = new ethers.utils.Interface(erc721Contract.abi);
const erc1155Interface = new ethers.utils.Interface(erc1155Contract.abi);

export async function approveErc20Token(
  tokenInfo: TokenInfo,
  provider: ethers.providers.Web3Provider,
  amount?: number,
): Promise<Transaction> {
  const contract = new ethers.Contract(
    tokenInfo.address,
    erc20Interface,
    provider.getSigner(),
  );

  const approveAmount = amount || constants.MaxUint256.toNumber();

  return contract.approve(
    Swap.getAddress(provider.network.chainId),
    approveAmount,
  );
}

export async function approveNftToken(
  baseToken: string,
  tokenId: string,
  provider: ethers.providers.Web3Provider,
  tokenKind: TokenKinds.ERC1155 | TokenKinds.ERC721,
): Promise<Transaction> {
  const contract = new ethers.Contract(
    baseToken,
    tokenKind === TokenKinds.ERC1155 ? erc1155Interface : erc721Interface,
    provider.getSigner(),
  );
  return contract.approve(
    Swap.getAddress(provider.network.chainId),
    tokenId,
  );
}

export async function takeOrder(
  order: FullOrder,
  senderWallet: string,
  provider: ethers.providers.Web3Provider,
): Promise<ContractTransaction | AppError> {
  try {
    const { chainId } = provider.network;
    const result = await Swap.getContract(provider.getSigner(), chainId).swap(
      senderWallet,
      '0',
      order,
    );

    return result;
  } catch (error: any) {
    console.error(error);
    return transformUnknownErrorToAppError(error);
  }
}

export async function cancelOrder(
  orderNonce: string,
  provider: ethers.providers.Web3Provider,
): Promise<ContractTransaction | AppError> {
  try {
    const { chainId } = provider.network;
    const result = await Swap.getContract(provider.getSigner(), chainId).cancel(
      [orderNonce],
    );

    return result;
  } catch (error: any) {
    console.error(error);
    return transformUnknownErrorToAppError(error);
  }
}

export async function checkOrder(
  order: FullOrder,
  senderWallet: string,
  provider: ethers.providers.Web3Provider,
): Promise<AppError[]> {
  const { chainId } = provider.network;

  const [count, checkErrors] = await Swap.getContract(provider.getSigner(), chainId).check(senderWallet, order);
  const errors = (count && checkErrors) ? checkResultToErrors(checkErrors, count) as SwapError[] : [];

  if (errors.length) {
    console.error(errors);
  }

  return errors.map((error) => transformSwapErrorToAppError(error));
}

export async function getNonceUsed(
  order: FullOrder,
  provider: ethers.providers.Web3Provider,
): Promise<boolean> {
  return Swap.getContract(provider, order.chainId).nonceUsed(
    order.signer.wallet,
    order.nonce,
  );
}

export async function getNftTokenApproved(
  baseToken: string,
  tokenId: string,
  provider: ethers.providers.Web3Provider,
  tokenKind: TokenKinds.ERC1155 | TokenKinds.ERC721,
): Promise<boolean> {
  try {
    const contract = new ethers.Contract(
      baseToken,
      tokenKind === TokenKinds.ERC1155 ? erc1155Interface : erc721Interface,
      provider.getSigner(),
    );

    const response = await contract.getApproved(tokenId);

    return response === Swap.getAddress(5);
  } catch (error: any) {
    console.error(error);

    return false;
  }
}

export async function getErc20TokenAllowance(
  address: string,
  account: string,
  spenderAddress: string,
  provider: ethers.providers.Web3Provider,
): Promise<ethers.BigNumber> {
  const contract = new ethers.Contract(
    address,
    erc20Interface,
    provider.getSigner(),
  );

  return contract.allowance(account, spenderAddress);
}
