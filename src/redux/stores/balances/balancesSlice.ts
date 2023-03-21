import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchAllowances, fetchBalances } from './balancesApi';

interface BalancesState {
  isLoading: boolean;
  isLoadingBalances: boolean;
  isLoadingAllowances: boolean;
  allowances: {
    [address: string]: string;
  }
  balances: {
    [address: string]: string;
  }
}

const initialState: BalancesState = {
  isLoading: false,
  isLoadingBalances: false,
  isLoadingAllowances: false,
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
    builder.addCase(fetchBalances.pending, (state): BalancesState => ({
      ...state,
      isLoading: true,
      isLoadingBalances: true,
    }));

    builder.addCase(fetchBalances.fulfilled, (state, action): BalancesState => ({
      ...state,
      isLoading: state.isLoadingAllowances,
      isLoadingBalances: false,
      balances: action.payload,
    }));
    builder.addCase(fetchAllowances.pending, (state): BalancesState => ({
      ...state,
      isLoadingAllowances: true,
    }));

    builder.addCase(fetchAllowances.fulfilled, (state, action): BalancesState => ({
      ...state,
      isLoading: state.isLoadingBalances,
      isLoadingAllowances: false,
      allowances: action.payload,
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
