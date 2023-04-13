import { useEffect, useState } from 'react';

import { Swap } from '@airswap/libraries';
import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { getErc20TokenAllowance } from '../redux/stores/orders/ordersApi';

const useSufficientErc20Allowance = (token?: TokenInfo, amount?: string): boolean => {
  const { account, chainId, library } = useWeb3React<Web3Provider>();

  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);

  useEffect(() => {
    if (
      !account
      || !amount
      || !chainId
      || !library
      || !token
    ) {
      return;
    }

    const callGetErc20TokenAllowance = async () => {
      const allowance = await getErc20TokenAllowance(
        token,
        account,
        Swap.getAddress(chainId),
        library,
      );

      setHasSufficientAllowance(allowance.gt(amount));
    };

    callGetErc20TokenAllowance();
  }, [
    account,
    amount,
    chainId,
    library,
    token,
  ]);

  return hasSufficientAllowance;
};

export default useSufficientErc20Allowance;
