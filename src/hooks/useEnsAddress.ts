import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

const useEnsAddress = (address?: string): string | undefined => {
  const { provider: library } = useWeb3React<Web3Provider>();
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
