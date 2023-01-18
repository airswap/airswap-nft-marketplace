import { store } from '../../store';
import { fetchBalances } from './balancesApi';

export const configureBalancesSubscriber = () => {
  let tokenKeysString: string;

  store.subscribe(() => {
    const { metadata, web3, library: libraryState } = store.getState();

    const newTokenKeys = Object.keys(metadata.tokens);
    const newTokenKeysString = newTokenKeys.toString();

    if (
      tokenKeysString !== newTokenKeysString
      && newTokenKeys.length
      && web3.chainId
      && web3.account
    ) {
      tokenKeysString = newTokenKeysString;

      store.dispatch(
        fetchBalances({
          chainId: web3.chainId,
          provider: libraryState.library[web3.chainId],
          tokenAddresses: Object.keys(metadata.tokens),
          walletAddress: web3.account,
        }),
      );
    }
  });
};
