import { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';

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

  useEffect(() => {
    dispatch(setWeb3Data({
      isActive,
      account: account || undefined,
      chainId,
    }));
  }, [
    isActive,
    account,
    chainId,
    library,
  ]);

  useEffect(() => {
    if (!library) {
      clearedCachedLibrary();
      dispatch(setHasLibrary(false));

      return;
    }

    if (library && chainId) {
      setCachedLibrary(library, chainId);
      dispatch(setHasLibrary(true));
    }
  }, [library]);
};

export default useMapWeb3ReactToStore;
