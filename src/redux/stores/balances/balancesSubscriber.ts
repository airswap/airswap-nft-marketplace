import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchCurrencyTokenAllowance, fetchCurrencyTokenBalance, fetchUserTokens } from './balancesApi';
import { setIsInitialized } from './balancesSlice';

export const configureBalancesSubscriber = () => {
  let account: string;
  let chainId: number;
  let lastTransactionHash: string | undefined;

  store.subscribe(() => {
    const {
      balances,
      config,
      transactions,
      web3,
    } = store.getState();

    const lastTransaction = transactions.all[0];
    const lastSucceededTransaction = lastTransaction?.status === 'succeeded' ? lastTransaction : undefined;

    if (!web3.chainId || !web3.account) {
      return;
    }

    if (
      account !== web3.account
      || chainId !== web3.chainId
      || (lastSucceededTransaction && lastSucceededTransaction.hash !== lastTransactionHash)
    ) {
      account = web3.account;
      chainId = web3.chainId;
      lastTransactionHash = lastSucceededTransaction?.hash;

      const library = getLibrary(web3.chainId);

      Promise.all([
        store.dispatch(fetchCurrencyTokenBalance({
          chainId: web3.chainId,
          provider: library,
          collectionTokenAddress: config.currencyToken,
          walletAddress: web3.account,
        })),

        store.dispatch(fetchCurrencyTokenAllowance({
          chainId: web3.chainId,
          provider: library,
          collectionTokenAddress: config.currencyToken,
          walletAddress: web3.account,
        })),

        store.dispatch(fetchUserTokens({
          provider: library,
          walletAddress: web3.account,
          collectionToken: config.collectionToken,
        })),
      ]).then(() => {
        if (!balances.isInitialized) {
          store.dispatch(setIsInitialized(true));
        }
      });
    }
  });
};
