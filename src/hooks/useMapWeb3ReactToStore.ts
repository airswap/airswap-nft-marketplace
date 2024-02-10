import { useWeb3React } from '@web3-react/core';
import { useDebounce } from 'react-use';

import { clearedCachedLibrary, setCachedLibrary } from '../helpers/ethers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setLibraries, setWeb3Data } from '../redux/stores/web3/web3Slice';

const useMapWeb3ReactToStore = (): void => {
  const dispatch = useAppDispatch();

  const { libraries } = useAppSelector((state) => state.web3);
  const { impersonateAddress } = useAppSelector((state) => state.config);

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
      account: impersonateAddress || account || undefined,
      chainId,
    }));
  }, 100, [
    isActive,
    account,
    chainId,
    impersonateAddress,
    library,
  ]);

  useDebounce(() => {
    if (!library) {
      clearedCachedLibrary();

      return;
    }

    if (library && chainId) {
      setCachedLibrary(library, chainId);
      dispatch(setLibraries({
        ...libraries,
        [chainId]: true,
      }));
    }
  }, 100, [library]);
};

export default useMapWeb3ReactToStore;
