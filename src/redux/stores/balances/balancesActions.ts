import { BigNumber } from 'ethers';

import { AppDispatch, RootState } from '../../store';
import { setBalances } from './balancesSlice';

export const incrementBalance = (
  tokenAddress: string,
  amount: string,
  subtract = false,
) => (dispatch: AppDispatch, getState: () => RootState): void => {
  const { balances } = getState();
  const newBalances = { ...balances.balances };
  const currentAmount = BigNumber.from(
    newBalances[tokenAddress.toLowerCase()] || 0,
  );
  newBalances[tokenAddress.toLowerCase()] = (subtract ? currentAmount.sub(amount) : currentAmount.add(amount)).toString();

  dispatch(setBalances(newBalances));
};

export const incrementAllowance = (
  tokenAddress: string,
  amount: string,
  subtract = false,
) => (dispatch: AppDispatch, getState: () => RootState): void => {
  const { balances } = getState();
  const newAllowances = { ...balances.allowances };
  const currentAmount = BigNumber.from(
    newAllowances[tokenAddress.toLowerCase()] || 0,
  );
  newAllowances[tokenAddress.toLowerCase()] = (subtract ? currentAmount.sub(amount) : currentAmount.add(amount)).toString();

  dispatch(setBalances(newAllowances));
};
