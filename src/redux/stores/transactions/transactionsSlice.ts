import { OrderERC20 } from '@airswap/types';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import {
  declineTransaction,
  expireTransaction,
  mineTransaction,
  revertTransaction,
  submitTransaction, updateTransaction,
} from './transactionActions';

export interface DepositOrWithdrawOrder {
  signerToken: string;
  signerAmount: string;
  senderToken: string;
  senderAmount: string;
}

export type TransactionType =
  | 'Approval'
  | 'Order'
  | 'Deposit'
  | 'Withdraw'
  | 'Cancel';

export type StatusType =
  | 'processing'
  | 'succeeded'
  | 'reverted'
  | 'declined'
  | 'expired';

export type ProtocolType = 'request-for-quote' | 'last-look';

export interface SubmittedTransaction {
  type: TransactionType;
  hash?: string; // LL orders doesn't have hash
  status: StatusType;
  nonce?: string;
  expiry?: string;
  timestamp: number;
  protocol?: ProtocolType;
}

export interface SubmittedTransactionWithOrder extends SubmittedTransaction {
  order: OrderERC20;
}

export type SubmittedRFQOrder = SubmittedTransactionWithOrder

export type SubmittedLastLookOrder = SubmittedTransactionWithOrder

export interface LastLookTransaction
  extends SubmittedTransaction,
  SubmittedLastLookOrder {}
export interface RfqTransaction
  extends SubmittedTransaction,
  SubmittedRFQOrder {}

export interface SubmittedApproval extends SubmittedTransaction {
  tokenAddress: string;
}

export type SubmittedCancellation = SubmittedTransaction

export interface SubmittedDepositOrder extends SubmittedTransaction {
  order: DepositOrWithdrawOrder;
}

export interface SubmittedWithdrawOrder extends SubmittedTransaction {
  order: DepositOrWithdrawOrder;
}

export interface TransactionsState {
  all: SubmittedTransaction[];
}

const initialState: TransactionsState = {
  all: [],
};

const expiryTimeouts: Record<string, number> = {};

const clearExpiry = (signerWallet?: string, nonce?: string) => {
  const uniqueKey = `${signerWallet}/${nonce}`;

  if (expiryTimeouts[uniqueKey]) {
    clearTimeout(expiryTimeouts[uniqueKey]);
    delete expiryTimeouts[uniqueKey];
  }
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clear: () => initialState,
    setTransactions: (state, action: PayloadAction<SubmittedTransaction[]>) => ({
      ...state,
      transactions: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(submitTransaction, (state, action) => {
      state.all.unshift(action.payload);
    });
    builder.addCase(declineTransaction, (state, action) => {
      console.error(action.payload);
      clearExpiry(action.payload.signerWallet, action.payload.nonce);
      updateTransaction({
        state,
        hash: action.payload.hash,
        nonce: action.payload.nonce,
        signerWallet: action.payload.signerWallet,
        status: 'declined',
        protocol: action.payload.protocol,
      });
    });
    builder.addCase(revertTransaction, (state, action) => {
      clearExpiry(action.payload.signerWallet, action.payload.nonce);
      updateTransaction({
        state,
        signerWallet: action.payload.signerWallet,
        nonce: action.payload.nonce,
        hash: action.payload.hash,
        status: 'reverted',
      });
    });
    builder.addCase(expireTransaction, (state, action) => {
      const { signerWallet, nonce } = action.payload;
      clearExpiry(signerWallet, nonce);
      updateTransaction({
        state,
        signerWallet,
        nonce,
        status: 'expired',
      });
    });
    builder.addCase(mineTransaction, (state, action) => {
      clearExpiry(action.payload.signerWallet, action.payload.nonce);
      updateTransaction({
        state,
        hash: action.payload.hash,
        nonce: action.payload.nonce,
        signerWallet: action.payload.signerWallet,
        status: 'succeeded',
        protocol: action.payload.protocol,
      });
    });
  },
});

export const { clear, setTransactions } = transactionsSlice.actions;
export const selectTransactions = (state: RootState) => state.transactions.all;

export const selectPendingTransactions = createSelector(
  selectTransactions,
  (transactions) => transactions.filter((tx) => tx.status === 'processing'),
);

export const selectPendingDeposits = (
  state: RootState,
): SubmittedDepositOrder[] => state.transactions.all.filter(
  (tx) => tx.status === 'processing' && tx.type === 'Deposit',
) as SubmittedDepositOrder[];

export const selectApprovals = (state: RootState) => state.transactions.all.filter(
  (tx) => tx.type === 'Approval',
) as SubmittedApproval[];

export const selectPendingApprovals = (state: RootState) => state.transactions.all.filter(
  (tx) => tx.status === 'processing' && tx.type === 'Approval',
) as SubmittedApproval[];

export const selectCancellations = (state: RootState) => state.transactions.all.filter(
  (tx) => tx.status === 'succeeded' && tx.type === 'Cancel',
) as SubmittedCancellation[];

export const selectPendingCancellations = (state: RootState) => state.transactions.all.filter(
  (tx) => tx.status === 'processing' && tx.type === 'Cancel',
) as SubmittedCancellation[];

export default transactionsSlice.reducer;
