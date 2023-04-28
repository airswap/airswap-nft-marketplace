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
  mineTransaction,
  revertTransaction,
  submitTransaction,
} from '../transactions/transactionActions';
import { SubmittedApproval, SubmittedTransactionWithOrder } from '../transactions/transactionsSlice';
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

export const approve = createAsyncThunk<
Transaction | AppError,
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

    if (tx.hash) {
      const transaction: SubmittedApproval = {
        type: 'Approval',
        hash: tx.hash,
        status: 'processing',
        tokenAddress: params.tokenInfo.address,
        timestamp: Date.now(),
      };
      dispatch(submitTransaction(transaction));
      library.once(tx.hash, async () => {
        // @ts-ignore
        const receipt = await library.getTransactionReceipt(tx.hash);
        // const state: RootState = getState() as RootState;
        // const tokens = Object.values(state.metadata.tokens.all);
        if (receipt.status === 1) {
          dispatch(mineTransaction({ hash: receipt.transactionHash }));
          // TODO: Add toasts to app
          // notifyTransaction(
          //   'Approval',
          //   transaction,
          //   tokens,
          //   false,
          //   params.chainId,
          // );
        } else {
          // @ts-ignore
          dispatch(revertTransaction(receipt.transactionHash));
          // TODO: Add toasts to app
          // notifyTransaction(
          //   'Approval',
          //   transaction,
          //   tokens,
          //   true,
          //   params.chainId,
          // );
        }
      });
    }

    return tx;
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

  const transaction: SubmittedTransactionWithOrder = {
    type: 'Order',
    hash: tx.hash,
    status: 'processing',
    order,
    timestamp: Date.now(),
  };
  dispatch(submitTransaction(transaction));
  library.once(tx.hash, async () => {
    const receipt = await library.getTransactionReceipt(tx.hash);
    if (receipt.status === 1) {
      dispatch(mineTransaction({ hash: receipt.transactionHash }));
    }
  });
});

