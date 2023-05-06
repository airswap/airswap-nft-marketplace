import { SubmittedTransaction, SubmittedTransactionStatus } from '../../../entities/SubmittedTransaction/SubmittedTransaction';
import { AppDispatch } from '../../store';
import { updateTransaction } from './transactionsActions';

export const getTransactionsLocalStorageKey = (account: string, chainId: number): string => `airswap-marketplace/transactions-v2/${account}/${chainId}`;

export const getLocalStorageTransactions = (account: string, chainId: number): SubmittedTransaction[] => {
  const key = getTransactionsLocalStorageKey(account, chainId);
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : [];
};

export const handleTransactionReceipt = (status: number, transaction: SubmittedTransaction, dispatch: AppDispatch): void => {
  dispatch(updateTransaction({
    ...transaction,
    status: status === 1 ? SubmittedTransactionStatus.succeeded : SubmittedTransactionStatus.failed,
  }));
};


