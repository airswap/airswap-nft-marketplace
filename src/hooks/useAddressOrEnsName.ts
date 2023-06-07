import { useLayoutEffect, useState } from 'react';

import truncateEthAddress from 'truncate-eth-address';

import useDefaultLibrary from './useDefaultProvider';

const useAddressOrEnsName = (address?: string, shouldTruncate = false) => {
  const library = useDefaultLibrary();

  const fallback = (shouldTruncate && address) ? truncateEthAddress(address) : address;
  const [result, setResult] = useState<string | undefined>(fallback);

  useLayoutEffect(() => {
    if (!address || !fallback) {
      return;
    }

    if (!library) {
      setResult(fallback);
      return;
    }

    library
      .lookupAddress(address)
      .then((name) => {
        setResult(name || fallback);
      })
      .catch(() => {
        setResult(fallback);
      });
  }, [library, address, fallback]);

  return result;
};

export default useAddressOrEnsName;
