import { useEffect, useState } from 'react';

import { FullOrder } from '@airswap/utils';

import { getFullOrderNonceUsed } from '../entities/FullOrder/FullOrderHelpers';
import useDefaultProvider from './useDefaultProvider';

const useFullOrderNonceUsed = (fullOrder?: FullOrder, usePolling = true): [boolean, boolean] => {
  const library = useDefaultProvider(fullOrder?.chainId);
  const [isLoading, setIsLoading] = useState(true);
  const [isNonceUsed, setIsNonceUsed] = useState(false);

  const getNonceUsedCall = async () => {
    if (!library || !fullOrder) {
      return;
    }

    const response = await getFullOrderNonceUsed(fullOrder, library);

    setIsNonceUsed(response);
    setIsLoading(!response);
  };

  useEffect((): () => void => {
    getNonceUsedCall();

    const timer = setInterval(async () => {
      if (!library || !fullOrder) {
        return;
      }

      const response = await getFullOrderNonceUsed(fullOrder, library);

      if (response || !usePolling) {
        clearInterval(timer);
      }

      setIsLoading(false);
      setIsNonceUsed(response);
    }, 1000);

    return () => clearInterval(timer);
  }, [fullOrder, library]);

  return [isNonceUsed, isLoading];
};

export default useFullOrderNonceUsed;
