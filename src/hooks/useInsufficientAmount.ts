import { useMemo } from 'react';

const useInsufficientAmount = (
  amount: string,
): boolean => useMemo(() => !amount.length
      || parseFloat(amount) === 0
      || amount === '.', [amount]);

export default useInsufficientAmount;
