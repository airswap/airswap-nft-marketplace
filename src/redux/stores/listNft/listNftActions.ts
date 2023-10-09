import { TokenKinds } from '@airswap/constants';
import { Swap } from '@airswap/libraries';
import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { createOrder } from '@airswap/utils';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { nativeCurrencyAddress } from '../../../constants/nativeCurrency';
import { AppErrorType, isAppError } from '../../../errors/appError';
import toRoundedAtomicString from '../../../helpers/airswap/getRoundedAtomicString';
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
  tokenId: string;
}

export const createNftOrder = createAsyncThunk<
FullOrder,
CreateOrderParams
>(
  'listNft/createOtcOrder',
  async (params, { dispatch, rejectWithValue }) => {
    dispatch(setError(undefined));

    try {
      const senderAmount = toRoundedAtomicString(
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
          token: params.senderTokenInfo.address,
          kind: TokenKinds.ERC20,
          amount: senderAmount,
        },
      });

      const { chainId } = params.signerTokenInfo;
      const signature = await createOrderSignature(
        unsignedOrder,
        params.library.getSigner(),
        Swap.getAddress(chainId) || '',
        chainId,
      );

      if (isAppError(signature)) {
        dispatch(setError({ type: signature.type }));

        return rejectWithValue({ type: signature.type });
      }

      const fullOrder: FullOrder = {
        ...unsignedOrder,
        ...signature,
        chainId,
        swapContract: Swap.getAddress(chainId) || '',
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
