import { store } from "../redux/store";
import { setLibrary } from '../redux/stores/library/libraryslice';

export const useSetLibrary = (
  provider: any
) => {
  store.dispatch(setLibrary(provider));

  let chainId = parseInt(provider.chainId, 16);
  const { library: libraryState } = store.getState();

  return libraryState.library[chainId];

};

export default useSetLibrary;
