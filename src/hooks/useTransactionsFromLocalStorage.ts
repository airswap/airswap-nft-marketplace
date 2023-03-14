import { useLocalStorageValue } from '@react-hookz/web/esm';
import { useWeb3React } from '@web3-react/core';

import { getTransactionsLocalStorageKey } from '../redux/stores/balances/balancesApi';
import { SubmittedTransaction } from '../redux/stores/transactions/transactionsSlice';

const useTransactionsFromLocalStorage = () => {
  const { account, chainId } = useWeb3React();
  const [transactions, setTransactions, clearTransactions] = useLocalStorageValue<{ all: SubmittedTransaction[] }>(
    getTransactionsLocalStorageKey(account || '-', chainId || 1),
    { all: [] },
    { handleStorageEvent: false },
  );
  return {
    transactions,
    setTransactions,
    clearTransactions,
  };
};

export default useTransactionsFromLocalStorage;
