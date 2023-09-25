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
      && web3.hasLibrary
    ) {
      userAccount = web3.account;
      const library = getLibrary(web3.chainId);

      const ensAddress = await library.lookupAddress(web3.account);
      store.dispatch(fetchAvatarByAddress({ address: ensAddress || web3.account }));
    }
  });
};
