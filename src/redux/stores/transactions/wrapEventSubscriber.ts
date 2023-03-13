import { Web3Provider } from '@ethersproject/providers';
import { Dispatch } from '@reduxjs/toolkit';
import { Contract } from 'ethers';

import { store, AppDispatch } from '../../store';
import { incrementBalance } from '../balances/balancesActions';
import { SubmittedTransactionWithOrder } from './transactionsSlice';

const handleWrapEvent = (data: any, dispatch: AppDispatch) => {
  const { transactions } = store.getState();

  const transaction: SubmittedTransactionWithOrder | null = (transactions.all.find(
    (t: any) => t.hash === data[2].transactionHash,
  ) as SubmittedTransactionWithOrder) || null;

  // If we don't have a 'transaction', we don't already know about this swap
  // and therefore don't need to update the UI.
  if (!transaction) return;

  dispatch(
    incrementBalance(
      transaction.order.senderToken,
      transaction.order.senderAmount,
    ),
  );
  dispatch(
    incrementBalance(
      transaction.order.signerToken,
      transaction.order.senderAmount,
      true,
    ),
  );
};

export default function subscribeToWrapEvents(params: {
  wrapContract: Contract;
  library: Web3Provider;
  dispatch: Dispatch;
}) {
  const { wrapContract, dispatch } = params;
  wrapContract.on('Deposit', async (...data) => handleWrapEvent(data, dispatch));
  wrapContract.on('Withdrawal', async (...data) => handleWrapEvent(data, dispatch));
}
