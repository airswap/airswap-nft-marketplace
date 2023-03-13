import { SwapERC20 } from '@airswap/libraries';
import { FullOrderERC20, OrderERC20 } from '@airswap/types';
import erc20Abi from 'erc-20-abi';
import {
  constants,
  ContractTransaction,
  ethers,
  Transaction,
} from 'ethers';

import { nativeCurrencyAddress } from '../../../constants/nativeCurrency';
import { AppError } from '../../../errors/appError';
import { SwapError, transformSwapErrorToAppError } from '../../../errors/swapError';
import transformUnknownErrorToAppError from '../../../errors/transformUnknownErrorToAppError';

const erc20Interface = new ethers.utils.Interface(erc20Abi);

function swap(
  chainId: number,
  provider: ethers.providers.Web3Provider,
  order: OrderERC20 | FullOrderERC20,
): Promise<ContractTransaction> {
  if ('senderWallet' in order && order.senderWallet === nativeCurrencyAddress) {
    return new SwapERC20(chainId, provider).swapAnySender(
      order,
      provider.getSigner(),
    );
  }
  return new SwapERC20(chainId, provider).swap(
    order,
    provider.getSigner(),
  );
}

export async function approveToken(
  baseToken: string,
  provider: ethers.providers.Web3Provider,
): Promise<Transaction> {
  const erc20Contract = new ethers.Contract(
    baseToken,
    erc20Interface,
    provider.getSigner(),
  );
  return erc20Contract.approve(
    SwapERC20.getAddress(provider.network.chainId),
    constants.MaxUint256,
  );
}

export async function takeOrder(
  order: OrderERC20 | FullOrderERC20,
  provider: ethers.providers.Web3Provider,
): Promise<Transaction | AppError> {
  return new Promise<Transaction | AppError>((resolve) => {
    swap(provider.network.chainId, provider, order)
      .then(tx => resolve(tx))
      .catch((error: any) => {
        transformUnknownErrorToAppError(error);
      });
  });
}

export async function check(
  order: OrderERC20,
  senderWallet: string,
  chainId: number,
  signer?: ethers.providers.JsonRpcSigner,
): Promise<AppError[]> {
  const errors = (await new SwapERC20(chainId, signer).check(
    order,
    senderWallet,
    signer,
  )) as SwapError[];

  if (errors.length) {
    console.error(errors);
  }

  return errors.map((error) => transformSwapErrorToAppError(error));
}

export async function getNonceUsed(
  order: FullOrderERC20,
  provider: ethers.providers.Web3Provider,
): Promise<boolean> {
  return new SwapERC20(order.chainId, provider).contract.nonceUsed(
    order.signerWallet,
    order.nonce,
  );
}
