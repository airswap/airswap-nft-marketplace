import { useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDebounce } from 'react-use';

// Hook for getting library from connected wallet or from rpc url, this way you can still use it in ethers.js methods

const useWeb3ReactLibrary = (): { library?: Web3Provider, chainId?: number } => {
  const { provider } = useWeb3React();

  const [library, setLibrary] = useState<Web3Provider>();

  // Using debounce because useWeb3React disconnects from provider every route for a split second
  useDebounce(() => {
    setLibrary(provider);
  }, 100, [provider]);

  return { library, chainId: library?.network?.chainId };
};

export default useWeb3ReactLibrary;
