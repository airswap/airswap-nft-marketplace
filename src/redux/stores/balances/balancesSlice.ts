import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

interface BalancesState {
  isLoading: boolean;
  balance?: BigNumber;
  allowance?: BigNumber;
  nftBalances?: {
    [address: string]: BigNumber;
  }
}

const initialState: BalancesState = {
  isLoading: false,
};

const balancesSlice = createSlice({
  name: 'balances',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
  },
});

export const {
  setIsLoading,
} = balancesSlice.actions;

export default balancesSlice.reducer;
