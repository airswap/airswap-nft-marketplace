import { useEffect, useState } from 'react';

import { FullOrder } from '@airswap/types';

import { getNonceUsed } from '../redux/stores/orders/ordersApi';
import useDefaultProvider from './useDefaultProvider';

const useFullOrderNonceUsed = (fullOrder?: FullOrder): [boolean, boolean] => {
  const library = useDefaultProvider(fullOrder?.chainId);
  const [isLoading, setIsLoading] = useState(true);
  const [isNonceUsed, setIsNonceUsed] = useState(false);

  useEffect((): () => void => {
    const timer = setInterval(async () => {
      if (!library || !fullOrder) {
        return;
      }

      const response = await getNonceUsed(fullOrder, library);

      if (response) {
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
