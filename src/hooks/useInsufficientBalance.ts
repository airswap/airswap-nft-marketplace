import { useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import { useAppSelector } from '../redux/hooks';

const useInsufficientBalance = (amount: string): boolean => {
  const { currencyTokenBalance } = useAppSelector(store => store.balances);

  return useMemo(() => new BigNumber(currencyTokenBalance).lt(amount), [currencyTokenBalance, amount]);
};

export default useInsufficientBalance;
