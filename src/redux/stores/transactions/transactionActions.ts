import { createAction } from '@reduxjs/toolkit';

import {
  ProtocolType, StatusType,
  SubmittedApproval, SubmittedLastLookOrder,
  SubmittedTransaction, TransactionsState,
} from './transactionsSlice';

const submitTransaction = createAction<
SubmittedTransaction | SubmittedApproval
>('transaction/submitTransaction');

const declineTransaction = createAction<{
  hash?: string;
  signerWallet?: string;
  nonce?: string;
  reason?: string;
  protocol?: ProtocolType;
}>('transactions/declineTransaction');

const mineTransaction = createAction<{
  protocol?: ProtocolType;
  signerWallet?: string;
  hash?: string;
  nonce?: string;
}>('transaction/mineTransaction');

const revertTransaction = createAction<{
  hash?: string;
  signerWallet?: string;
  nonce?: string;
  reason?: string;
}>('transactions/revertTransaction');

const expireTransaction = createAction<{
  signerWallet: string;
  nonce: string;
}>('transactions/expireTransaction');

interface UpdateTransactionParams {
  state: TransactionsState;
  nonce?: string;
  hash?: string;
  signerWallet?: string;
  status: StatusType;
  protocol?: ProtocolType;
}

export const updateTransaction = (params: UpdateTransactionParams) => {
  const {
    state,
    nonce,
    hash,
    signerWallet,
    status,
  } = params;

  if (!!signerWallet && !!nonce) {
    const swap = state.all.find(s => s.nonce === nonce
      && (s as SubmittedLastLookOrder).order.signerWallet.toLowerCase() === signerWallet.toLowerCase());

    if (swap) {
      swap.timestamp = Date.now();
      swap.status = status;
      swap.hash = hash;
    }
  } else if (hash) {
    const swap = state.all.find((s) => s.hash === hash);
    if (swap) {
      swap.status = status;
    }
  } else {
    console.warn(
      "Can't update transaction without either signerWallet and nonce, ",
      'or transaction hash\n',
      'Supplied params: ',
      params,
    );
  }
};

export {
  submitTransaction,
  declineTransaction,
  mineTransaction,
  revertTransaction,
  expireTransaction,
};
