import { useMemo } from 'react';

import { useAppSelector } from '../redux/hooks';
import { selectApprovals, SubmittedApproval } from '../redux/stores/transactions/transactionsSlice';

const useApproveNftTransaction = (): SubmittedApproval | undefined => {
  const { collectionToken } = useAppSelector(state => state.config);
  const pendingTransactions = useAppSelector(selectApprovals);

  return useMemo(() => {
    if (!pendingTransactions.length) {
      return undefined;
    }

    return pendingTransactions.find(transaction => transaction.tokenAddress === collectionToken);
  }, [pendingTransactions]);
};

export default useApproveNftTransaction;
