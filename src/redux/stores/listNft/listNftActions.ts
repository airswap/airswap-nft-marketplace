import { TokenKinds } from '@airswap/constants';
import * as swapDeploys from '@airswap/swap/deploys';
import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { createOrder, toAtomicString } from '@airswap/utils';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { nativeCurrencyAddress } from '../../../constants/nativeCurrency';
import { AppError, AppErrorType, isAppError } from '../../../errors/appError';
import { createOrderSignature } from '../../../helpers/createOrderSignature';
import { setError, setUserOrder } from './listNftSlice';

interface CreateOrderParams {
  expiry: string;
  library: Web3Provider;
  protocolFee: number;
  signerTokenInfo: CollectionTokenInfo;
  signerWallet: string;
  senderAmount: string;
  senderTokenInfo: TokenInfo;
  tokenId: number;
}

export const createNftOrder = createAsyncThunk<
FullOrder | AppError,
CreateOrderParams
>(
  'make-otc/createOtcOrder',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(setError(undefined));

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
          wallet: nativeCurrencyAddress,
          token: params.signerTokenInfo.address,
          kind: TokenKinds.ERC20,
          amount: senderAmount,
        },
      });

      const { chainId } = params.signerTokenInfo;
      const signature = await createOrderSignature(
        unsignedOrder,
        params.library.getSigner(),
        swapDeploys[chainId],
        chainId,
      );

      if (isAppError(signature)) {
        dispatch(setError(signature));

        return rejectWithValue(signature);
      }

      const fullOrder: FullOrder = {
        ...unsignedOrder,
        ...signature,
        chainId,
        swapContract: swapDeploys[chainId],
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
