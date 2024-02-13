import { useEffect } from 'react';

import { CollectionTokenInfo, FullOrder } from '@airswap/utils';

import useDefaultLibrary from '../../../hooks/useDefaultProvider';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearLastUserOrder } from '../listNft/listNftSlice';
import { initialize } from './indexerApi';
import { sendOrderToIndexers } from './indexerHelpers';
import { setLastFailedOrder, setLastSentOrder } from './indexerSlice';

export const useIndexers = (): void => {
  const dispatch = useAppDispatch();

  const { lastUserOrder } = useAppSelector(state => state.listNft);
  const { chainId } = useAppSelector(state => state.config);
  const { isInitialized, isLoading, urls } = useAppSelector(state => state.indexer);
  const library = useDefaultLibrary(chainId);

  const sendAndClearLastOrder = async (lastOrder: FullOrder, token: CollectionTokenInfo) => {
    if (!isInitialized) return;

    const isSuccessful = await sendOrderToIndexers(lastOrder, token, urls);

    if (isSuccessful) {
      dispatch(setLastSentOrder(lastOrder));
    } else {
      dispatch(setLastFailedOrder(lastOrder));
    }

    dispatch(clearLastUserOrder());
  };

  useEffect(() => {
    if (library && !isInitialized && !isLoading) {
      dispatch(initialize({ chainId, provider: library }));
    }
  }, [library]);

  useEffect(() => {
    if (lastUserOrder) sendAndClearLastOrder(lastUserOrder.order, lastUserOrder.token);
  }, [lastUserOrder]);
};
