import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchProtocolFee } from './metadataActions';
import { getCurrencyTokenInfo } from './metadataApi';

export const configureMetadataSubscriber = () => {
  let initialized = false;

  store.subscribe(() => {
    const { config, web3 } = store.getState();

    if (!initialized && web3.chainId) {
      initialized = true;

      const library = getLibrary(web3.chainId);

      store.dispatch(getCurrencyTokenInfo({
        currencyToken: config.currencyToken,
        library,
        chainId: web3.chainId,
      }));

      store.dispatch(fetchProtocolFee({
        provider: library,
        chainId: web3.chainId,
      }));
    }
  });
};
