import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchAvatarByAddress } from './userApi';

export const configureUserSubscriber = () => {
  let userAccount = '';

  store.subscribe(async () => {
    const { web3 } = store.getState();

    if (!web3.account) {
      userAccount = '';
    }

    if (
      web3.account
      && userAccount !== web3.account
      && web3.chainId
      && web3.libraries[web3.chainId]
    ) {
      const library = getLibrary(web3.chainId);

      if (!library) {
        return;
      }

      userAccount = web3.account;

      const ensAddress = web3.chainId === 1 ? await library.lookupAddress(web3.account) : undefined;
      store.dispatch(fetchAvatarByAddress({ address: ensAddress || web3.account }));
    }
  });
};
