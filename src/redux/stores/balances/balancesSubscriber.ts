import { SubmittedTransactionType } from '../../../entities/SubmittedTransaction/SubmittedTransaction';
import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchCurrencyTokenAllowance, fetchCurrencyTokenBalance, fetchUserTokens } from './balancesApi';
import {
  setAllowance,
  setBalance,
  setIsInitialized,
  setTokens,
} from './balancesSlice';

export const configureBalancesSubscriber = () => {
  let account: string;
  let chainId: number;
  let lastTransactionHash: string | undefined;

  store.subscribe(() => {
    const { config, transactions, web3 } = store.getState();

    const lastTransaction = transactions.transactions[0];
    const lastSucceededTransaction = lastTransaction?.status === 'succeeded' ? lastTransaction : undefined;

    if (web3.chainId && chainId !== web3.chainId && web3.chainId !== config.chainId) {
      chainId = web3.chainId;

      store.dispatch(setIsInitialized(false));
      store.dispatch(setAllowance('0'));
      store.dispatch(setBalance('0'));
      store.dispatch(setTokens([]));

      return;
    }

    if (!web3.chainId || !web3.account) {
      return;
    }

    if (account !== web3.account || chainId !== web3.chainId) {
      account = web3.account;
      chainId = web3.chainId;

      const library = getLibrary(chainId);

      store.dispatch(setIsInitialized(false));

      Promise.all([
        store.dispatch(fetchCurrencyTokenBalance({
          chainId,
          provider: library,
          collectionTokenAddress: config.currencyToken,
          walletAddress: account,
        })),

        store.dispatch(fetchCurrencyTokenAllowance({
          chainId,
          provider: library,
          collectionTokenAddress: config.currencyToken,
          walletAddress: account,
        })),

        store.dispatch(fetchUserTokens({
          provider: library,
          walletAddress: account,
          collectionToken: config.collectionToken,
        })),
      ]).then(() => {
        store.dispatch(setIsInitialized(true));
      });
    }

    if (lastSucceededTransaction && lastSucceededTransaction.hash !== lastTransactionHash) {
      lastTransactionHash = lastSucceededTransaction.hash;

      const library = getLibrary(web3.chainId);

      if (lastSucceededTransaction.type === SubmittedTransactionType.order) {
        store.dispatch(fetchUserTokens({
          provider: library,
          walletAddress: web3.account,
          collectionToken: config.collectionToken,
        }));

        store.dispatch(fetchCurrencyTokenBalance({
          chainId: web3.chainId,
          provider: library,
          collectionTokenAddress: config.currencyToken,
          walletAddress: web3.account,
        }));
      }

      if (lastSucceededTransaction.type === SubmittedTransactionType.erc20Approval) {
        store.dispatch(fetchCurrencyTokenAllowance({
          chainId: web3.chainId,
          provider: library,
          collectionTokenAddress: config.currencyToken,
          walletAddress: web3.account,
        }));
      }
    }
  });
};
