import { useEffect } from 'react';

import { FullOrder } from '@airswap/types';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearLastUserOrder } from '../listNft/listNftSlice';
import { initialize } from './indexerApi';
import { sendOrderToIndexers } from './indexerHelpers';
import { setLastFailedOrder, setLastSentOrder } from './indexerSlice';

export const useIndexers = (): void => {
  const dispatch = useAppDispatch();

  const { library } = useWeb3React();
  const { lastUserOrder } = useAppSelector(state => state.listNft);
  const { chainId } = useAppSelector(state => state.config);
  const { isInitialized, urls } = useAppSelector(state => state.indexer);

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
