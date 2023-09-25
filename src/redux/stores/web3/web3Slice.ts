import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ConnectionType } from '../../../web3-connectors/connections';
import { saveLastProviderToLocalStorage } from './web3Api';


export interface Web3State {
  hasLibrary: boolean;
  isActive: boolean;
  isInitialized: boolean;
  account?: string;
  chainId?: number;
  walletName?: string;
  connectionType?: ConnectionType;
  error?: Error;
}

const initialState: Web3State = {
  hasLibrary: false,
  isActive: false,
  isInitialized: false,
};

export const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    setWeb3Data: (state, action: PayloadAction<Omit<Web3State, 'isInitialized' | 'hasLibrary'>>) => ({
      ...state,
      ...action.payload,
    }),
    setConnectionType: (state, action: PayloadAction<ConnectionType>) => {
      if (action.payload) {
        saveLastProviderToLocalStorage(action.payload);
      }

      return {
        ...state,
        connectionType: action.payload,
      };
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isInitialized: action.payload,
    }),
    setHasLibrary: (state, action: PayloadAction<boolean>) => ({
      ...state,
      hasLibrary: action.payload,
    }),
    setError: (state, action: PayloadAction<Error | undefined>) => ({
      ...state,
      error: action.payload,
    }),
  },
});

export const {
  setConnectionType,
  setError,
  setHasLibrary,
  setIsInitialized,
  setWeb3Data,
} = web3Slice.actions;

export default web3Slice.reducer;
