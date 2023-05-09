import { useMemo } from 'react';

import { Erc20ApprovalTransaction } from '../entities/SubmittedTransaction/SubmittedTransaction';
import { useAppSelector } from '../redux/hooks';
import { selectErc20ApprovalTransactions } from '../redux/stores/transactions/transactionsSlice';

const useApproveCurrencyTokenTransaction = (hash?: string): Erc20ApprovalTransaction | undefined => {
  const transactions = useAppSelector(selectErc20ApprovalTransactions);

  return useMemo(() => {
    if (!transactions.length || !hash) {
      return undefined;
    }

    return transactions.find(transaction => transaction.hash === hash);
  }, [transactions, hash]);
};

export default useApproveCurrencyTokenTransaction;
