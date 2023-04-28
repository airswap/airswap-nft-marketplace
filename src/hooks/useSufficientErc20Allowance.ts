import { useEffect, useState } from 'react';

import { TokenInfo } from '@airswap/types';
import { BigNumber } from 'bignumber.js';

import { useAppSelector } from '../redux/hooks';

const useSufficientErc20Allowance = (token?: TokenInfo, amount?: string): boolean => {
  const { currencyTokenAllowance } = useAppSelector((state) => state.balances);

  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);

  useEffect(() => {
    if (!amount) {
      return;
    }

    setHasSufficientAllowance(new BigNumber(currencyTokenAllowance).gte(amount));
  }, [amount, currencyTokenAllowance]);

  return hasSufficientAllowance;
};

export default useSufficientErc20Allowance;
