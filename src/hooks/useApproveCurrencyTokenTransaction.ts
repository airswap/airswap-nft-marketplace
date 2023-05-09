import { useMemo } from 'react';

import { useAppSelector } from '../redux/hooks';
import { selectApprovals, SubmittedApproval } from '../redux/stores/transactions/transactionsSlice';

const useApproveCurrencyTokenTransaction = (): SubmittedApproval | undefined => {
  const { currencyToken } = useAppSelector(state => state.config);
  const pendingTransactions = useAppSelector(selectApprovals);

  return useMemo(() => {
    if (!pendingTransactions.length) {
      return undefined;
    }

    return pendingTransactions.find(transaction => transaction.tokenAddress === currencyToken);
  }, [pendingTransactions]);
};

export default useApproveCurrencyTokenTransaction;
