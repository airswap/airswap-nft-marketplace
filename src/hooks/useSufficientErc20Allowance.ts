import { useEffect, useState } from 'react';

import { FullOrder } from '@airswap/types';
import { BigNumber } from 'bignumber.js';

import { getFullOrderSenderAmountPlusTotalFees } from '../entities/FullOrder/FullOrderHelpers';
import { useAppSelector } from '../redux/hooks';

const useSufficientErc20Allowance = (fullOrder: FullOrder): boolean => {
  const { currencyTokenAllowance } = useAppSelector((state) => state.balances);

  const [hasSufficientAllowance, setHasSufficientAllowance] = useState(false);

  useEffect(() => {
    const amount = getFullOrderSenderAmountPlusTotalFees(fullOrder);
    setHasSufficientAllowance(new BigNumber(currencyTokenAllowance).gte(amount));
  }, [fullOrder, currencyTokenAllowance]);

  return hasSufficientAllowance;
};

export default useSufficientErc20Allowance;
