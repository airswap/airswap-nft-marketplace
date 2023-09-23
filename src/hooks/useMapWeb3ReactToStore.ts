import { useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch } from '../redux/hooks';
import { setWeb3Data } from '../redux/stores/web3/web3Slice';

const useMapWeb3ReactToStore = (): void => {
  const dispatch = useAppDispatch();

  const {
    account,
    isActive,
    chainId,
    provider: library,
  } = useWeb3React<Web3Provider>();

  useEffect(() => {
    dispatch(setWeb3Data({
      isActive,
      account: account || undefined,
      chainId,
    }));
  }, [isActive, account, chainId, library]);

  // useEffect(() => {
  //   dispatch(setError(error));
  // }, [error]);
};

export default useMapWeb3ReactToStore;
