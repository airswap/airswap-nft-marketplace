import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppSelector } from '../redux/hooks';
import { selectPendingApprovals } from '../redux/stores/transactions/transactionsSlice';

const useApprovalPending = (tokenAddress?: string | null): boolean => {
  const { chainId } = useWeb3React<Web3Provider>();
  const pendingApprovals = useAppSelector(selectPendingApprovals);

  return useMemo(() => {
    if (!tokenAddress || !pendingApprovals.length || !chainId) {
      return false;
    }

    return pendingApprovals.some((tx) => tx.tokenAddress === tokenAddress);
  }, [tokenAddress, pendingApprovals, chainId]);
};

export default useApprovalPending;
