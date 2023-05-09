import { useMemo } from 'react';

import { OrderTransaction } from '../entities/SubmittedTransaction/SubmittedTransaction';
import { useAppSelector } from '../redux/hooks';
import { selectOrderTransactions } from '../redux/stores/transactions/transactionsSlice';

const useOrderTransaction = (orderNonce: string): OrderTransaction | undefined => {
  const pendingOrders = useAppSelector(selectOrderTransactions);

  return useMemo(() => {
    if (!orderNonce || !pendingOrders.length) {
      return undefined;
    }

    return pendingOrders.find(tx => tx.order.nonce === orderNonce);
  }, [orderNonce, pendingOrders]);
};

export default useOrderTransaction;
