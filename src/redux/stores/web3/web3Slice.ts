import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { saveLastProviderToLocalStorage } from './web3Api';


export interface Web3State {
  isActive: boolean;
  isInitialized: boolean;
  account?: string;
  chainId?: number;
  walletName?: string;
  error?: Error;
}

const initialState: Web3State = {
  isActive: false,
  isInitialized: false,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    setWeb3Data: (state, action: PayloadAction<Omit<Web3State, 'isInitialized'>>) => ({
      ...state,
      ...action.payload,
    }),
    setWalletName: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        saveLastProviderToLocalStorage(action.payload);
      }

      return {
        ...state,
        walletName: action.payload,
      };
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isInitialized: action.payload,
    }),
    setError: (state, action: PayloadAction<Error | undefined>) => ({
      ...state,
      error: action.payload,
    }),
  },
});

export const {
  setError,
  setIsInitialized,
  setWalletName,
  setWeb3Data,
} = web3Slice.actions;

export default web3Slice.reducer;
