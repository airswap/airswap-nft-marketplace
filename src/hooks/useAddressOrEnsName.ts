import { useEffect, useLayoutEffect, useState } from 'react';

import truncateEthAddress from 'truncate-eth-address';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setEnsAddresses } from '../redux/stores/metadata/metadataSlice';
import useDefaultLibrary from './useDefaultProvider';

const useAddressOrEnsName = (address?: string, shouldTruncate = false) => {
  const dispatch = useAppDispatch();
  const library = useDefaultLibrary();

  const { ensAddresses } = useAppSelector((state) => state.metadata);

  const fallback = (shouldTruncate && address) ? truncateEthAddress(address) : address;
  const [lookedUpAddress, setLookedUpAddress] = useState<string | null>();
  const [result, setResult] = useState<string | undefined>(fallback);

  useLayoutEffect(() => {
    if (!address || !fallback) {
      return;
    }

    if (address in ensAddresses) {
      setResult(ensAddresses[address] || fallback);

      return;
    }

    if (!library) {
      setResult(fallback);

      return;
    }

    library
      .lookupAddress(address)
      .then((name) => {
        setLookedUpAddress(name);
        setResult(name || fallback);
      })
      .catch(() => {
        setResult(fallback);
      });
  }, [library, address, fallback]);

  useEffect(() => {
    if (address && lookedUpAddress !== undefined) {
      dispatch(setEnsAddresses({
        ...ensAddresses,
        [address]: lookedUpAddress,
      }));
    }
  }, [lookedUpAddress]);

  return result;
};

export default useAddressOrEnsName;
