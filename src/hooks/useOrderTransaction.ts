import { useMemo } from 'react';

import { useAppSelector } from '../redux/hooks';
import { selectOrders, SubmittedOrder } from '../redux/stores/transactions/transactionsSlice';

const useOrderTransaction = (orderNonce: string): SubmittedOrder | undefined => {
  const pendingOrders = useAppSelector(selectOrders);

  return useMemo(() => {
    if (!orderNonce || !pendingOrders.length) {
      return undefined;
    }

    return pendingOrders.find(tx => tx.order.nonce === orderNonce);
  }, [orderNonce, pendingOrders]);
};

export default useOrderTransaction;
