import { store } from '../../store';
import { Web3State } from '../web3/web3Slice';
import { scrapeTokens } from './metadataApi';

export const configureMetadataSubscriber = () => {
  let account: Web3State['account'];
  let chainId: Web3State['chainId'];

  store.subscribe(() => {
    const { config, web3 } = store.getState();

    if ((web3.account !== account || web3.chainId !== chainId) && web3.library && web3.chainId) {
      account = web3.account;
      chainId = web3.chainId;

      store.dispatch(scrapeTokens({
        tokens: [config.currencyToken, config.collectionToken],
        provider: web3.library,
        chainId: web3.chainId,
      }));
    }
  });
};
