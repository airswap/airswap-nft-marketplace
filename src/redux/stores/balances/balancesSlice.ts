import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchBalances } from './balancesApi';

interface BalancesState {
  isLoading: boolean;
  allowances: {
    [address: string]: string;
  }
  balances: {
    [address: string]: string;
  }
}

const initialState: BalancesState = {
  isLoading: false,
  allowances: {},
  balances: {},
};

const balancesSlice = createSlice({
  name: 'balances',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
    setAllowances: (state, action: PayloadAction<{ [address: string]: string; }>) => ({
      ...state,
      allowances: action.payload,
    }),
    setAllowance: (state, action: PayloadAction<{ address: string, amount: string }>) => {
      const newAllowances = { ...state.allowances };
      newAllowances[action.payload.address] = action.payload.amount;

      return {
        ...state,
        allowances: newAllowances,
      };
    },
    setBalances: (state, action: PayloadAction<{ [address: string]: string; }>) => ({
      ...state,
      balances: action.payload,
    }),
    setBalance: (state, action: PayloadAction<{ address: string, amount: string }>) => {
      const newBalances = { ...state.balances };
      newBalances[action.payload.address] = action.payload.amount;

      return {
        ...state,
        balances: newBalances,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchBalances.pending, (state) => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(fetchBalances.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      balances: action.payload,
    }));
  },
});

export const {
  setIsLoading,
  setAllowance,
  setAllowances,
  setBalance,
  setBalances,
} = balancesSlice.actions;

export default balancesSlice.reducer;
