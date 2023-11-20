import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';

import useWeb3ReactLibrary from './useWeb3ReactLibrary';

const useEnsAddress = (address?: string): string | undefined => {
  const { library } = useWeb3ReactLibrary();
  const [lookedUpAddress, setLookedUpAddress] = useState<string | null>(null);

  const lookupAddress = async (provider: Web3Provider, value: string) => {
    // Note: lookupAddress only seems to work on mainnet.
    const newLookedUpAddress = await provider.lookupAddress(value);
    setLookedUpAddress(newLookedUpAddress);
  };

  useEffect(() => {
    if (!library || !address) {
      return;
    }

    lookupAddress(library, address);
  }, [library, address]);

  return lookedUpAddress || undefined;
};

export default useEnsAddress;
