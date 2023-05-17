
import { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { clearLastUserOrder } from '../listNft/listNftSlice';
import { initializeIndexers } from './indexerApi';

export const useIndexers = (): void => {
  const dispatch = useAppDispatch();

  const { library } = useWeb3React();
  const { lastUserOrder } = useAppSelector(state => state.listNft);
  const { chainId } = useAppSelector(state => state.config);

  useEffect(() => {
    dispatch(initializeIndexers({ chainId, provider: library }));
  }, [library]);

  useEffect(() => {
    if (!lastUserOrder) {
      return;
    }

    // dispatch to sendOrderToIndexers here
    dispatch(clearLastUserOrder());
  }, [lastUserOrder]);
};
