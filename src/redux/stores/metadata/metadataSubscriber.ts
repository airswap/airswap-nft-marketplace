import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { scrapeTokens } from './metadataApi';

export const configureMetadataSubscriber = () => {
  let initialized = false;

  store.subscribe(() => {
    const { config, web3 } = store.getState();

    if (!initialized && web3.chainId) {
      initialized = true;

      const library = getLibrary(web3.chainId);

      store.dispatch(scrapeTokens({
        tokens: [config.currencyToken, config.collectionToken],
        library,
        chainId: web3.chainId,
      }));
    }
  });
};
