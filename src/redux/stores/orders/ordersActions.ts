import { TokenKinds } from '@airswap/constants';
import { FullOrderERC20, OrderERC20, TokenInfo } from '@airswap/types';
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
import { setAllowance } from '../balances/balancesSlice';
import {
  declineTransaction,
  mineTransaction,
  revertTransaction,
  submitTransaction,
} from '../transactions/transactionActions';
import { SubmittedApproval } from '../transactions/transactionsSlice';
import { approveErc20Token, approveNftToken, takeOrder } from './ordersApi';
import { setError } from './ordersSlice';

const APPROVE_AMOUNT = '90071992547409910000000000';

interface ApproveParams {
  tokenInfo: TokenInfo;
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

    const tokenKind = (tokenInfo.extensions?.kind || TokenKinds.ERC20) as TokenKinds;

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
          dispatch(
            mineTransaction({
              hash: receipt.transactionHash,
            }),
          );
          dispatch(setAllowance({ address: tokenInfo.address, amount: APPROVE_AMOUNT }));
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
  order: OrderERC20 | FullOrderERC20;
  library: any;
  onExpired: () => void;
}

export const take = createAsyncThunk<
// Return type of the payload creator
void,
// Params
TakeParams,
// Types for ThunkAPI
{
  dispatch: AppDispatch;
  state: RootState;
}
>('orders/take', async (params, { dispatch }) => {
  const tx = await takeOrder(params.order, params.library);

  if (isAppError(tx)) {
    const appError = tx;
    if (appError.type === AppErrorType.rejectedByUser) {
      // TODO: Add Toasts to app
      // notifyRejectedByUserError();
      dispatch(
        revertTransaction({
          signerWallet: params.order.signerWallet,
          nonce: params.order.nonce,
          reason: appError.type,
        }),
      );
    } else {
      dispatch(setError(appError));
    }

    if (appError.error && 'message' in appError.error) {
      dispatch(declineTransaction(appError.error.message));
    }

    throw appError;
  }
});
