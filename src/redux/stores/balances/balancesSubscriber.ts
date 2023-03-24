import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import {
  fetchAllowances, fetchBalances, fetchTokenIds,
} from './balancesApi';

export const configureBalancesSubscriber = () => {
  let tokenKeysString: string;
  let tokenIdsFetched = false;

  store.subscribe(() => {
    const { metadata, web3, config } = store.getState();

    const newTokenKeys = Object.keys(metadata.tokens);
    const newTokenKeysString = newTokenKeys.toString();

    if (!web3.chainId || !web3.account || !config.collectionToken) return;
    const library = getLibrary(web3.chainId);

    if (
      tokenKeysString !== newTokenKeysString
      && newTokenKeys.length
    ) {
      tokenKeysString = newTokenKeysString;

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
    }

    if (config.collectionToken && !tokenIdsFetched) {
      tokenIdsFetched = true;

      store.dispatch(fetchTokenIds({
        provider: library,
        walletAddress: web3.account,
        collectionTokenAddress: config.collectionToken,
      }));
    }
  });
};
