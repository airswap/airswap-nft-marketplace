import { TokenKinds } from '@airswap/constants';
import { CollectionTokenInfo, FullOrder, TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from 'ethers';

import {
  AppError,
  AppErrorType,
  isAppError,
  transformToAppError,
} from '../../../errors/appError';
import transformUnknownErrorToAppError from '../../../errors/transformUnknownErrorToAppError';
import { AppDispatch, RootState } from '../../store';
import {
  addERC20ApprovalTransaction,
  addNftApprovalTransaction,
  addOrderTransaction,
} from '../transactions/transactionsActions';
import {
  approveErc20Token,
  approveNftToken,
  checkOrder,
  takeOrder,
} from './ordersApi';
import { setError } from './ordersSlice';

interface ApproveParams {
  tokenInfo: TokenInfo | CollectionTokenInfo;
  library: Web3Provider;
  chainId: number;
  tokenId?: number;
}

type TransactionHash = Transaction['hash'];

export const approve = createAsyncThunk<
TransactionHash | AppError,
ApproveParams,
{
  dispatch: AppDispatch;
  state: RootState;
}
>('orders/approve', async (params, { dispatch, rejectWithValue }) => {
  dispatch(setError(undefined));

  try {
    let tx: Transaction;
    const { tokenInfo, library, tokenId } = params;

    const tokenKind = 'kind' in tokenInfo ? tokenInfo.kind : TokenKinds.ERC20;

    if (tokenKind !== TokenKinds.ERC20 && !tokenId) {
      console.error('[orders/approve]: Missing tokenId when submitting ERC721 or ERC1155 approval');

      return rejectWithValue(transformToAppError(AppErrorType.unknownError));
    }

    if ((tokenKind === TokenKinds.ERC721 || tokenKind === TokenKinds.ERC1155) && tokenId) {
      tx = await approveNftToken(
        tokenInfo.address,
        tokenId,
        library,
        tokenKind,
      );
    } else {
      tx = await approveErc20Token(tokenInfo.address, library);
    }

    if (tx.hash && tokenKind === TokenKinds.ERC20) {
      dispatch(addERC20ApprovalTransaction(tx.hash));
    } else if (tx.hash && tokenId) {
      dispatch(addNftApprovalTransaction(tx.hash, tokenId));
    }

    return tx.hash;
  } catch (e: any) {
    console.error(e);
    const error = transformUnknownErrorToAppError(e);
    dispatch(setError(error));

    return rejectWithValue(error);
  }
});

interface TakeParams {
  senderWallet: string;
  order: FullOrder;
  library: Web3Provider;
}

export const take = createAsyncThunk<
void,
TakeParams,
{
  dispatch: AppDispatch;
  state: RootState;
}
>('orders/take', async (params, { dispatch }) => {
  const { order, library, senderWallet } = params;

  const checkErrors = await checkOrder(
    order,
    senderWallet,
    library,
  );

  if (checkErrors.length) {
    dispatch(setError(checkErrors[0]));

    throw checkErrors[0];
  }

  const tx = await takeOrder(params.order, senderWallet, params.library);

  if (isAppError(tx)) {
    dispatch(setError(tx));

    throw tx;
  }

  if (tx.hash) {
    dispatch(addOrderTransaction(tx.hash, order));
  }
});

