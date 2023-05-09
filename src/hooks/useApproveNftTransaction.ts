import { useMemo } from 'react';

import { NftApprovalTransaction } from '../entities/SubmittedTransaction/SubmittedTransaction';
import { useAppSelector } from '../redux/hooks';
import { selectNftApprovalTransactions } from '../redux/stores/transactions/transactionsSlice';

const useApproveNftTransaction = (hash?: string): NftApprovalTransaction | undefined => {
  const transactions = useAppSelector(selectNftApprovalTransactions);

  return useMemo(() => {
    if (!transactions.length || !hash) {
      return undefined;
    }

    return transactions.find(transaction => transaction.hash === hash);
  }, [transactions, hash]);
};

export default useApproveNftTransaction;
