import { useMemo } from 'react';

import { BaseProvider } from '@ethersproject/providers/src.ts/base-provider';
import { useWeb3React } from '@web3-react/core';
import { getDefaultProvider } from 'ethers';

import { getRpcUrl } from '../helpers/ethers';

// Hook for getting library from connected wallet or from rpc url, this way you can still use it in ethers.js methods

const useDefaultLibrary = (chainId?: number): BaseProvider | undefined => {
  const { provider } = useWeb3React();

  return useMemo(() => {
    if (provider || !chainId) {
      return provider;
    }

    return getDefaultProvider(getRpcUrl(chainId));
  }, [provider, chainId]);
};

export default useDefaultLibrary;
