import { useWeb3React } from '@web3-react/core';
import { useDebounce } from 'react-use';

import { clearedCachedLibrary, setCachedLibrary } from '../helpers/ethers';
import { useAppDispatch } from '../redux/hooks';
import { setHasLibrary, setWeb3Data } from '../redux/stores/web3/web3Slice';

const useMapWeb3ReactToStore = (): void => {
  const dispatch = useAppDispatch();

  const {
    account,
    isActive,
    chainId,
    provider: library,
  } = useWeb3React();

  // Using debounce because useWeb3React disconnects from provider every route for a split second
  useDebounce(() => {
    dispatch(setWeb3Data({
      isActive,
      account: account || undefined,
      chainId,
    }));
  }, 100, [
    isActive,
    account,
    chainId,
    library,
  ]);

  useDebounce(() => {
    if (!library) {
      clearedCachedLibrary();
      dispatch(setHasLibrary(false));

      return;
    }

    if (library && chainId) {
      setCachedLibrary(library, chainId);
      dispatch(setHasLibrary(true));
    }
  }, 100, [library]);
};

export default useMapWeb3ReactToStore;
