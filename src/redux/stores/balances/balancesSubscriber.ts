import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchCurrencyTokenAllowance, fetchCurrencyTokenBalance, fetchUserTokens } from './balancesApi';

export const configureBalancesSubscriber = () => {
  let account: string;
  let chainId: number;

  store.subscribe(() => {
    const { web3, config } = store.getState();

    if (!web3.chainId || !web3.account) {
      return;
    }

    if (account !== web3.account || chainId !== web3.chainId) {
      account = web3.account;
      chainId = web3.chainId;

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
