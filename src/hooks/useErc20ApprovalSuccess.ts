import { useMemo } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppSelector } from '../redux/hooks';
import { selectApprovals } from '../redux/stores/transactions/transactionsSlice';

const useErc20ApprovalSuccess = (tokenAddress?: string | null): boolean => {
  const { chainId } = useWeb3React<Web3Provider>();
  const approvals = useAppSelector(selectApprovals);

  return useMemo(() => {
    if (!tokenAddress || !approvals.length || !chainId) {
      return false;
    }

    console.log(approvals);
    const tokenApprovals = approvals.filter(approval => approval.tokenAddress === tokenAddress);
    const lastApproval = tokenApprovals[0];

    return lastApproval?.status === 'succeeded';
  }, [tokenAddress, approvals, chainId]);
};

export default useErc20ApprovalSuccess;
