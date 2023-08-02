import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  CancelOrderTransaction,
  Erc20ApprovalTransaction,
  NftApprovalTransaction,
  OrderTransaction,
  SubmittedTransaction,
} from '../../../entities/SubmittedTransaction/SubmittedTransaction';
import {
  isCancelOrderTransaction,
  isErc20ApprovalTransaction,
  isNftApprovalTransaction,
  isOrderTransaction,
} from '../../../entities/SubmittedTransaction/SubmittedTransactionHelpers';
import { RootState } from '../../store';

interface TransactionsState {
  isLoading: boolean;
  transactions: SubmittedTransaction[];
}

const initialState: TransactionsState = {
  isLoading: false,
  transactions: [],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
    setTransactions: (state, action: PayloadAction<SubmittedTransaction[]>) => ({
      ...state,
      transactions: action.payload,
    }),
  },
});

export const {
  setIsLoading,
  setTransactions,
} = transactionsSlice.actions;

export const selectErc20ApprovalTransactions = (state: RootState): Erc20ApprovalTransaction[] => state.transactions.transactions
  .filter(isErc20ApprovalTransaction);

export const selectNftApprovalTransactions = (state: RootState): NftApprovalTransaction[] => state.transactions.transactions
  .filter(isNftApprovalTransaction);

export const selectCancelOrderTransactions = (state: RootState): CancelOrderTransaction[] => state.transactions.transactions
  .filter(isCancelOrderTransaction);

export const selectOrderTransactions = (state: RootState): OrderTransaction[] => state.transactions.transactions
  .filter(isOrderTransaction);

export default transactionsSlice.reducer;
