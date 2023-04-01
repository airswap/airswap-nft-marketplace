import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchAllowances, fetchBalances, fetchUserTokens } from './balancesApi';

interface BalancesState {
  isLoading: boolean;
  isLoadingAllowances: boolean;
  isLoadingBalances: boolean;
  isLoadingTokens: boolean;
  allowances: {
    [address: string]: string;
  };
  balances: {
    [address: string]: string;
  };
  tokens: number[];
}

const initialState: BalancesState = {
  isLoading: false,
  isLoadingAllowances: false,
  isLoadingBalances: false,
  isLoadingTokens: false,
  allowances: {},
  balances: {},
  tokens: [],
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
      isLoading: state.isLoadingAllowances || state.isLoadingTokens,
      isLoadingBalances: false,
      balances: action.payload,
    }));

    builder.addCase(fetchUserTokens.pending, (state): BalancesState => ({
      ...state,
      isLoading: true,
      isLoadingTokens: true,
    }));

    builder.addCase(fetchUserTokens.fulfilled, (state, action): BalancesState => ({
      ...state,
      isLoading: state.isLoadingAllowances || state.isLoadingBalances,
      isLoadingTokens: false,
      tokens: action.payload,
    }));

    builder.addCase(fetchAllowances.pending, (state): BalancesState => ({
      ...state,
      isLoading: true,
      isLoadingAllowances: true,
    }));

    builder.addCase(fetchAllowances.fulfilled, (state, action): BalancesState => ({
      ...state,
      isLoading: state.isLoadingBalances || state.isLoadingTokens,
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
