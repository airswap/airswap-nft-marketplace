import { useMemo } from 'react';

import { BaseProvider } from '@ethersproject/providers/src.ts/base-provider';
import { getDefaultProvider } from 'ethers';

import { getLibrary, getRpcUrl } from '../helpers/ethers';
import { useAppSelector } from '../redux/hooks';

// Hook for getting library from connected wallet or from rpc url, this way you can still use it in ethers.js methods

const useDefaultLibrary = (chainId?: number): BaseProvider | undefined => {
  const { isActive, chainId: providerChainId } = useAppSelector(state => state.web3);

  return useMemo(() => {
    const library = providerChainId ? getLibrary(providerChainId) : undefined;

    if ((!chainId && library) || (library && chainId === providerChainId)) {
      return library;
    }

    return chainId ? getDefaultProvider(getRpcUrl(chainId)) : undefined;
  }, [isActive, chainId]);
};

export default useDefaultLibrary;
