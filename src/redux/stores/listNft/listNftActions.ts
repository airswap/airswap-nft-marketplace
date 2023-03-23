import { TokenKinds } from '@airswap/constants';
// @ts-ignore
// eslint-disable-next-line import/no-extraneous-dependencies
import * as swapDeploys from '@airswap/swap/deploys';
import { FullOrder, TokenInfo } from '@airswap/types';
import { createOrder, toAtomicString } from '@airswap/utils';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppError, AppErrorType, isAppError } from '../../../errors/appError';
import { createOrderSignature } from '../../../helpers/createOrderSignature';
import { setError, setUserOrder } from './listNftSlice';

interface CreateOrderParams {
  chainId: number
  expiry: string;
  library: Web3Provider;
  nonce: string;
  protocolFee: number;
  signerTokenInfo: TokenInfo;
  signerWallet: string;
  senderAmount: string;
  senderTokenInfo: TokenInfo;
  senderWallet: string;
  tokenId: number;
}

export const createOtcOrder = createAsyncThunk<
FullOrder | AppError,
CreateOrderParams
>(
  'make-otc/createOtcOrder',
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const senderAmount = toAtomicString(
        params.senderAmount,
        params.senderTokenInfo.decimals,
      );

      const unsignedOrder = createOrder({
        expiry: params.expiry,
        nonce: Date.now(),
        protocolFee: params.protocolFee,
        signer: {
          wallet: params.signerWallet,
          token: params.signerTokenInfo.address,
          kind: TokenKinds.ERC721,
          id: params.tokenId,
        },
        sender: {
          wallet: params.senderWallet,
          token: params.signerTokenInfo.address,
          kind: TokenKinds.ERC20,
          amount: senderAmount,
        },
      });

      const signature = await createOrderSignature(
        unsignedOrder,
        // @ts-ignore
        params.library.getSigner(),
        swapDeploys[params.chainId],
        params.chainId,
      );

      if (isAppError(signature)) {
        dispatch(setError(signature));

        return rejectWithValue(signature);
      }

      const fullOrder: FullOrder = {
        ...unsignedOrder,
        ...signature,
        chainId: params.chainId,
        swapContract: swapDeploys[params.chainId],
      };

      dispatch(setUserOrder(fullOrder));
      return fullOrder;
    } catch (error) {
      console.error(error);
      dispatch(setError({ type: AppErrorType.unknownError }));

      return rejectWithValue({ type: AppErrorType.unknownError });
    }
  },
);
