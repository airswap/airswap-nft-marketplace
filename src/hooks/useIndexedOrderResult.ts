import { useEffect, useState } from 'react';

import { AppError, AppErrorType } from '../errors/appError';
import { useAppSelector } from '../redux/hooks';
import { IndexedOrderResult } from '../types/IndexedOrderResult';

const useIndexedOrderResult = (orderNonce?: string): [IndexedOrderResult | undefined, AppError | undefined] => {
  const { lastSentOrder, lastFailedOrder } = useAppSelector(state => state.indexer);
  const [result, setResult] = useState<IndexedOrderResult | undefined>(undefined);
  const indexerError: AppError | undefined = result === IndexedOrderResult.failed ? { type: AppErrorType.orderIndexFailed } : undefined;

  useEffect(() => {
    if (!orderNonce) {
      setResult(undefined);

      return;
    }

    if (lastSentOrder?.nonce === orderNonce) {
      setResult(IndexedOrderResult.success);
    }

    if (lastFailedOrder?.nonce === orderNonce) {
      setResult(IndexedOrderResult.failed);
    }
  }, [orderNonce, lastSentOrder, lastFailedOrder]);

  return [result, indexerError];
};

export default useIndexedOrderResult;
