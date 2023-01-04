import { store } from '../../store';
import { scrapeTokens } from './metadataApi';

export const configureMetadataSubscriber = () => {
  let initialized = false;

  store.subscribe(() => {
    const { config, web3 } = store.getState();

    if (!initialized && web3.library && config.currencyToken && config.collectionToken) {
      initialized = true;

      store.dispatch(scrapeTokens({
        tokens: [config.currencyToken, config.collectionToken],
        library: web3.library,
        chainId: web3.chainId,
      }));
    }
  });
};
