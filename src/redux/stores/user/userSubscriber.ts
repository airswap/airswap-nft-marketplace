import { Web3Provider } from '@ethersproject/providers';

import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';

export const getLib = (): Web3Provider | null => {
  const { web3 } = store.getState();
  if (!web3.chainId) return null;
  const library = getLibrary(web3.chainId);
  return library;
};

export const configureUserSubscriber = () => {
  // dispatch here ?
  // how to give the address to the createAsyncChunk parameter exaclty ?
  store.subscribe(async () => {
    const state = store.getState();
    if (!state.user) return;
    const { address } = state.user;
    const library = getLib();
    if (!library || !address) return;
    const ensAddress = await library.lookupAddress(address);
    console.log('configureUserSubscriber:: ensAddress', ensAddress);
    store.dispatch({ type: 'user/fetchAvatarByAddress', payload: ensAddress });
  });
};
