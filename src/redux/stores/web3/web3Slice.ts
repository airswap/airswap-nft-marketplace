import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Web3State {
  isActive: boolean;
  account?: string;
  chainId?: number;
  error?: Error;
  library?: Web3Provider;
}

const initialState: Web3State = {
  isActive: false,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    setWeb3Data: (state, action: PayloadAction<Web3State>) => ({
      ...state,
      ...action.payload,
    }),
    setError: (state, action: PayloadAction<Error | undefined>) => ({
      ...state,
      error: action.payload,
    }),
  },
});

export const {
  setError,
  setWeb3Data,
} = web3Slice.actions;

export default web3Slice.reducer;
