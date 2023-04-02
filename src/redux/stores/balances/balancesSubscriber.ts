import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchAllowances, fetchBalances, fetchUserTokens } from './balancesApi';

export const configureBalancesSubscriber = () => {
  let tokenKeysString: string;
  let account: string;
  let chainId: number;

  store.subscribe(() => {
    const { metadata, web3, config } = store.getState();

    const newTokenKeys = Object.keys(metadata.tokens);
    const newTokenKeysString = newTokenKeys.toString();

    if (!newTokenKeys.length || !web3.chainId || !web3.account) {
      return;
    }

    if (tokenKeysString !== newTokenKeysString || account !== web3.account || chainId !== web3.chainId) {
      tokenKeysString = newTokenKeysString;
      account = web3.account;
      chainId = web3.chainId;

      const library = getLibrary(web3.chainId);

      store.dispatch(fetchBalances({
        chainId: web3.chainId,
        provider: library,
        tokenAddresses: Object.keys(metadata.tokens),
        walletAddress: web3.account,
      }));

      store.dispatch(fetchAllowances({
        chainId: web3.chainId,
        provider: library,
        tokenAddresses: Object.keys(metadata.tokens),
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
