import { Dispatch } from '@reduxjs/toolkit';
import { Contract, Event as EthersEvent } from 'ethers';

import { store } from '../../store';
import { mineTransaction } from './transactionActions';
import { LastLookTransaction } from './transactionsSlice';
import { SwapEventArgs } from './transactionUtils';

export default function subscribeToSwapEvents(params: {
  swapContract: Contract;
  chainId: number;
  account: string;
  library: any;
  dispatch: Dispatch;
}) {
  const { swapContract, account, dispatch } = params;

  const _account = account.toLowerCase();

  const onSwap = async (...argsAndEvent: any[]) => {
    // Listeners are called with all args first, then an event object.
    const swapEvent: EthersEvent = argsAndEvent[argsAndEvent.length - 1];
    const args = swapEvent.args as unknown as SwapEventArgs;

    dispatch(
      mineTransaction({
        signerWallet: args.signerWallet,
        nonce: args.nonce.toString(),
        hash: swapEvent.transactionHash,
        protocol:
          args.signerWallet.toLowerCase() === _account
            ? 'last-look'
            : 'request-for-quote',
      }),
    );

    const { transactions } = store.getState();

    const matchingTransaction = transactions.transactions.find((tx) => tx.hash === swapEvent.transactionHash);

    if (matchingTransaction) {
      // TODO: Add toasts to app
      // notifyTransaction(
      //   'Order',
      //   matchingTransaction,
      //   Object.values(store.getState().metadata.tokens.all),
      //   false,
      //   chainId,
      // );
    }
  };
  swapContract.on('SwapERC20', onSwap);
}
