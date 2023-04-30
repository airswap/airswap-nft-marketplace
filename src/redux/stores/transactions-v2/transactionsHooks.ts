import { useEffect, useState } from 'react';

import { TransactionReceipt } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getLocalStorageTransactions,
  getTransactionsLocalStorageKey,
  handleTransactionReceipt,
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
      .map(transaction => {
        library.once(transaction.hash, () => {
          library.getTransactionReceipt(transaction.hash)
            .then((receipt: TransactionReceipt) => {
              if (receipt?.status !== undefined) {
                handleTransactionReceipt(receipt.status, transaction, dispatch);
              }
            });
        });
        return transaction.hash;
      });

    setActiveListenerHashes([...activeListenerHashes, ...newListenerHashes]);
  }, [transactions]);

  useEffect(() => {
    if (!account || !chainId) {
      return;
    }

    dispatch(setTransactions(getLocalStorageTransactions(account, chainId)));
  }, [account, chainId]);
};
