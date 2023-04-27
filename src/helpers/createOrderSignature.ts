import { Signature, UnsignedOrder } from '@airswap/types';
import { createOrderSignature as airswapCreateOrderSignature } from '@airswap/utils';
import { JsonRpcSigner } from '@ethersproject/providers/src.ts/json-rpc-provider';

import { AppError } from '../errors/appError';
import transformUnknownErrorToAppError from '../errors/transformUnknownErrorToAppError';

export const createOrderSignature = (
  unsignedOrder: UnsignedOrder,
  signer: JsonRpcSigner,
  swapContract: string,
  chainId: number,
  // eslint-disable-next-line no-async-promise-executor
): Promise<Signature | AppError> => new Promise<Signature | AppError>(async (resolve) => {
  try {
    const signature = await airswapCreateOrderSignature(
      unsignedOrder,
      // @ts-ignore
      // Airswap library asking for incorrect VoidSigner. This will be fixed later.
      signer,
      swapContract,
      chainId,
    );
    resolve(signature);
  } catch (error: unknown) {
    console.error(error);
    resolve(transformUnknownErrorToAppError(error));
  }
});
