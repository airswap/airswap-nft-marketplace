import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getLocalStorageTransactions,
  getTransactionsLocalStorageKey,
  listenForTransactionReceipt,
} from './transactionsHelpers';
import { setTransactions } from './transactionsSlice';

export const useTransactions = (): void => {
  const dispatch = useAppDispatch();

  const { library } = useWeb3React();
  const { account, chainId } = useAppSelector(state => state.web3);
  const { transactions } = useAppSelector(state => state.transactions);

  const [activeListenerHashes, setActiveListenerHashes] = useState<string[]>([]);

  useEffect(() => {
    if (!account || !chainId) {
      return;
    }

    const localStorageKey = getTransactionsLocalStorageKey(account, chainId);
    localStorage.setItem(localStorageKey, JSON.stringify(transactions));

    const newListenerHashes = transactions
      .filter(transaction => transaction.status === 'processing' && !activeListenerHashes.includes(transaction.hash))
      .map(transaction => listenForTransactionReceipt(transaction, library, dispatch));

    setActiveListenerHashes([...activeListenerHashes, ...newListenerHashes]);
  }, [transactions]);

  useEffect(() => {
    if (!account || !chainId) {
      return;
    }

    dispatch(setTransactions(getLocalStorageTransactions(account, chainId)));
  }, [account, chainId]);
};
