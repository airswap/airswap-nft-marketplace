import { store } from '../../store';
import { scrapeTokens } from './metadataApi';

export const configureMetadataSubscriber = () => {
  let initialized = false;

  store.subscribe(() => {
    const { config, web3, library: libraryState } = store.getState();

    if (!initialized && web3.chainId) {
      initialized = true;
      const chainId = web3.chainId.toString();

      store.dispatch(
        scrapeTokens({
          tokens: [config.currencyToken, config.collectionToken],
          library: libraryState.library[chainId],
          chainId: web3.chainId,
        }),
      );
    }
  });
};
