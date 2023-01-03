import { store } from '../../store';
import { ConfigState } from '../config/configSlice';

export const configureMetadataSubscriber = () => {
  let currencyToken: ConfigState['currencyToken'];
  // let collectionToken: ConfigState['currencyToken'];

  store.subscribe(() => {
    const { config } = store.getState();
    if (config.currencyToken !== currencyToken) {
      currencyToken = config.currencyToken;

      // Fetch metadata here
      // store.dispatch(fetchMetadata());
    }
  });
};
