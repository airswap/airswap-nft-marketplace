import { useMemo } from 'react';

import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'bignumber.js';

import findEthOrTokenByAddress from '../helpers/findEthOrTokenByAddress';
import { useAppSelector } from '../redux/hooks';

const useSufficientErc20Allowance = (
  token?: TokenInfo,
  amount?: string,
): boolean => {
  const { chainId } = useWeb3React<Web3Provider>();
  const tokens = useAppSelector(state => state.metadata.tokens);
  const allowances = useAppSelector(state => state.balances.allowances);

  return useMemo(() => {
    if (!token || !amount || !chainId) {
      return false;
    }

    const justifiedToken = findEthOrTokenByAddress(
      token.address,
      Object.values(tokens),
      chainId,
    );

    const tokenAllowance = justifiedToken ? allowances[justifiedToken.address] : undefined;

    if (!tokenAllowance) {
      // safer to return true here (has allowance) as validator will catch the
      // missing allowance, so the user won't swap, and they won't pay
      // unnecessary gas for an approval they may not need.
      return true;
    }

    return new BigNumber(tokenAllowance)
      .div(10 ** justifiedToken.decimals)
      .gte(amount);
  }, [allowances, amount, token, tokens, chainId]);
};

export default useSufficientErc20Allowance;
