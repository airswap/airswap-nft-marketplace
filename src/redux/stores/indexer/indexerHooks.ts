import { useEffect } from 'react';

import { FullOrder } from '@airswap/types';

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
  const { isInitialized, urls } = useAppSelector(state => state.indexer);
  const library = useDefaultLibrary(chainId);

  const sendAndClearLastOrder = async (lastOrder: FullOrder) => {
    if (!isInitialized) return;

    const isSuccessful = await sendOrderToIndexers(lastOrder, urls);

    if (isSuccessful) {
      dispatch(setLastSentOrder(lastOrder));
    } else {
      dispatch(setLastFailedOrder(lastOrder));
    }

    dispatch(clearLastUserOrder());
  };

  useEffect(() => {
    if (library) {
      dispatch(initialize({ chainId, provider: library }));
    }
  }, [library]);

  useEffect(() => {
    if (lastUserOrder) sendAndClearLastOrder(lastUserOrder);
  }, [lastUserOrder]);
};
