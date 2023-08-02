import { useMemo } from 'react';

import { CancelOrderTransaction } from '../entities/SubmittedTransaction/SubmittedTransaction';
import { useAppSelector } from '../redux/hooks';
import {
  selectCancelOrderTransactions,
} from '../redux/stores/transactions/transactionsSlice';

const useCancelOrderTransaction = (hash?: string): CancelOrderTransaction | undefined => {
  const transactions = useAppSelector(selectCancelOrderTransactions);

  return useMemo(() => {
    if (!transactions.length || !hash) {
      return undefined;
    }

    return transactions.find(transaction => transaction.hash === hash);
  }, [transactions, hash]);
};

export default useCancelOrderTransaction;
