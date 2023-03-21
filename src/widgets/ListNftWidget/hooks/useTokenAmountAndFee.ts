import { useMemo } from 'react';

import { BigNumber } from 'bignumber.js';

import useInsufficientAmount from '../../../hooks/useInsufficientAmount';
import { useAppSelector } from '../../../redux/hooks';

const useTokenAmountAndFee = (amount: string): [string | undefined, string | undefined] => {
  const { protocolFee } = useAppSelector(state => state.metadata);
  const hasInsufficientAmount = useInsufficientAmount(amount);

  return useMemo(() => {
    if (hasInsufficientAmount) {
      return [undefined, undefined];
    }

    const feeAmount = new BigNumber(amount).multipliedBy(protocolFee / 10000);
    const tokenAmountMinusFee = new BigNumber(amount).minus(feeAmount);

    return [tokenAmountMinusFee.toString(), feeAmount.toString()];
  }, [hasInsufficientAmount, amount, protocolFee]);
};

export default useTokenAmountAndFee;
