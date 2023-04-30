import { Order } from '@airswap/types';

import {
  Erc20ApprovalTransaction,
  NftApprovalTransaction,
  OrderTransaction,
  SubmittedTransaction,
} from '../../../entities/SubmittedTransaction/SubmittedTransaction';
import { AppDispatch, RootState } from '../../store';
import { setTransactions } from './transactionsSlice';

export const updateTransaction = (updatedTransaction: SubmittedTransaction) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { transactions } = getState().transactions;
  const transactionIndex = transactions.findIndex(transaction => transaction.hash === updatedTransaction.hash);

  if (transactionIndex === -1) {
    return;
  }

  const updatedTransactions = [...transactions];
  updatedTransactions.splice(transactionIndex, 1, updatedTransaction);

  dispatch(setTransactions(updatedTransactions));
};

export const addERC20ApprovalTransaction = (hash: string) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { transactions } = getState().transactions;

  const transaction: Erc20ApprovalTransaction = {
    type: 'erc20-approval',
    hash,
    status: 'processing',
    timestamp: Date.now(),
  };

  dispatch(setTransactions([
    transaction,
    ...transactions,
  ]));
};

export const addNftApprovalTransaction = (hash: string, tokenId: number) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { transactions } = getState().transactions;

  const transaction: NftApprovalTransaction = {
    type: 'nft-approval',
    hash,
    tokenId,
    status: 'processing',
    timestamp: Date.now(),
  };

  dispatch(setTransactions([
    transaction,
    ...transactions,
  ]));
};

export const addOrderTransaction = (hash: string, order: Order) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { transactions } = getState().transactions;

  const transaction: OrderTransaction = {
    type: 'order',
    hash,
    order,
    status: 'processing',
    timestamp: Date.now(),
  };

  dispatch(setTransactions([
    transaction,
    ...transactions,
  ]));
};
