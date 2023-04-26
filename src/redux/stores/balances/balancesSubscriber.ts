import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { TransactionStatus } from '../transactions/transactionsSlice';
import { fetchCurrencyTokenAllowance, fetchCurrencyTokenBalance, fetchUserTokens } from './balancesApi';

export const configureBalancesSubscriber = () => {
  let account: string;
  let chainId: number;
  let lastTransactionStatus: TransactionStatus | undefined;

  store.subscribe(() => {
    const { web3, config, transactions } = store.getState();
    const lastTransaction = transactions.all[transactions.all.length - 1];

    if (!web3.chainId || !web3.account) {
      return;
    }

    if (account !== web3.account || chainId !== web3.chainId || (lastTransaction && lastTransaction.status !== lastTransactionStatus)) {
      account = web3.account;
      chainId = web3.chainId;
      lastTransactionStatus = lastTransaction?.status;

      const library = getLibrary(web3.chainId);

      store.dispatch(fetchCurrencyTokenBalance({
        chainId: web3.chainId,
        provider: library,
        collectionTokenAddress: config.currencyToken,
        walletAddress: web3.account,
      }));

      store.dispatch(fetchCurrencyTokenAllowance({
        chainId: web3.chainId,
        provider: library,
        collectionTokenAddress: config.currencyToken,
        walletAddress: web3.account,
      }));

      store.dispatch(fetchUserTokens({
        provider: library,
        walletAddress: web3.account,
        collectionToken: config.collectionToken,
      }));
    }
  });
};
