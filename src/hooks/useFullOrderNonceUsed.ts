import { useEffect, useState } from 'react';

import { FullOrder } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { getNonceUsed } from '../redux/stores/orders/ordersApi';

const useFullOrderNonceUsed = (fullOrder?: FullOrder): [boolean, boolean] => {
  const { library } = useWeb3React<Web3Provider>();
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
