import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setEnsAddresses } from '../redux/stores/metadata/metadataSlice';
import useWeb3ReactLibrary from './useWeb3ReactLibrary';

const useEnsAddress = (address?: string): string | undefined => {
  const dispatch = useAppDispatch();
  const { library } = useWeb3ReactLibrary();

  const { chainId } = useAppSelector((state) => state.config);
  const { ensAddresses } = useAppSelector((state) => state.metadata);

  const [lookedUpAddress, setLookedUpAddress] = useState<string | null>(null);

  const lookupAddress = async (provider: Web3Provider, value: string) => {
    // Note: lookupAddress only seems to work on mainnet.
    const newLookedUpAddress = await provider.lookupAddress(value);
    setLookedUpAddress(newLookedUpAddress);
  };

  useEffect(() => {
    if (!library || !address || chainId !== 1) {
      return;
    }

    if (address in ensAddresses) {
      setLookedUpAddress(ensAddresses[address]);

      return;
    }

    lookupAddress(library, address);
  }, [library, address]);

  useEffect(() => {
    if (address && lookupAddress !== undefined) {
      dispatch(setEnsAddresses({
        ...ensAddresses,
        [address]: lookedUpAddress,
      }));
    }
  }, [lookedUpAddress]);

  return lookedUpAddress || undefined;
};

export default useEnsAddress;
