import { useCustomCompareEffect } from '@react-hookz/web';
import { useWeb3React } from '@web3-react/core';
import { Event } from 'ethers';

import { useAppDispatch } from '../redux/hooks';
import {
  setTransactions,
  SubmittedTransactionWithOrder,
} from '../redux/stores/transactions/transactionsSlice';
import {
  checkPendingTransactionState,
  getSwapArgsFromWrappedSwapForLog,
  SwapEventArgs,
} from '../redux/stores/transactions/transactionUtils';
import useSwapLogs from './useSwapLogs';
import useTransactionsFromLocalStorage from './useTransactionsFromLocalStorage';

const useHistoricalTransactions = () => {
  const { chainId, library, account } = useWeb3React();
  const { result: swapLogs, status: swapLogStatus } = useSwapLogs();
  const {
    transactions: localStorageTransactions,
    setTransactions: setLocalStorageTransactions,
  } = useTransactionsFromLocalStorage();
  const dispatch = useAppDispatch();

  useCustomCompareEffect(
    () => {
      if (swapLogStatus === 'loading' || swapLogStatus === 'not-executed') return;
      if (
        !swapLogs
        || swapLogs.chainId !== chainId
        || swapLogs.account !== account
      ) return;

      const localTransactionsCopy = { all: [...localStorageTransactions.all] };

      const updateStorage: () => void = async () => {
        let lastLookSwapLogs: Event[] = [];
        let rfqSwapLogs: Event[] = [];
        let wrappedSwapLogs: Event[] = [];

        if (swapLogs) {
          lastLookSwapLogs = swapLogs.lastLookSwapLogs;
          rfqSwapLogs = swapLogs.rfqSwapLogs;
          wrappedSwapLogs = swapLogs.wrappedSwapLogs;
        }

        const reconcileLogs = async (
          protocol: 'last-look' | 'request-for-quote',
          logs: Event[],
          isWrapped = false,
        ) => {
          await Promise.all(
            logs.map(async (swapLog) => {
              const args = isWrapped
                ? await getSwapArgsFromWrappedSwapForLog(swapLog)
                : (swapLog.args as unknown as SwapEventArgs);

              const matchedTxFromStorage = localStorageTransactions.all.find(
                (tx) => {
                  if (protocol !== tx.protocol) return false;

                  const { order } = tx as SubmittedTransactionWithOrder;
                  return (
                    order.nonce === args.nonce.toString()
                    && order.signerWallet.toLowerCase()
                      === args.signerWallet.toLowerCase()
                  );
                },
              );
              if (matchedTxFromStorage) {
                // We already knew this one had succeeded.
                if (matchedTxFromStorage.status === 'succeeded') return;

                matchedTxFromStorage.status = 'succeeded';
              } else {
                // We don't have a record of this transaction, so we need to create it.
                // const newTransaction:
                const blockTimestamp = (await swapLog.getBlock()).timestamp;
                const newTx: SubmittedTransactionWithOrder = {
                  protocol,
                  status: 'succeeded',
                  timestamp: blockTimestamp * 1000,
                  type: 'Order',
                  hash: swapLog.transactionHash,
                  nonce: args.nonce.toString(),
                  order: {
                    expiry: '-',
                    nonce: args.nonce.toString(),
                    signerWallet: args.signerWallet,
                    signerToken: args.signerToken,
                    senderToken: args.senderToken,
                    senderAmount: args.senderAmount.toString(),
                    signerAmount: args.signerAmount.toString(),
                    v: '-',
                    r: '-',
                    s: '-',
                  },
                };
                localTransactionsCopy.all.push(newTx);
              }
            }),
          );
        };

        await Promise.all([
          reconcileLogs('last-look', lastLookSwapLogs),
          reconcileLogs('request-for-quote', rfqSwapLogs),
          reconcileLogs('request-for-quote', wrappedSwapLogs, true),
        ]);

        setLocalStorageTransactions(localTransactionsCopy);
        dispatch(setTransactions(localTransactionsCopy.all));

        localTransactionsCopy.all
          .filter((tx) => tx.status === 'processing')
          .forEach((tx) => {
            checkPendingTransactionState(tx, dispatch, library);
          });
      };

      updateStorage();
    },
    [
      account,
      chainId,
      swapLogs,
      swapLogStatus,
      localStorageTransactions,
      setLocalStorageTransactions,
      dispatch,
      library,
    ],
    (
      // eslint-disable-next-line @typescript-eslint/no-shadow
      [account, chainId, swapLogs, swapLogStatus],
      [accountNew, chainIdNew, swapLogsNew, swapLogStatusNew],
    ) =>
      // This is a change comparator so that we don't run this effect too
      // frequently. Without this, we'd get an infinite loop because the
      // effect modifies the transactions stored in localStorage.
      // eslint-disable-next-line implicit-arrow-linebreak
      (
        swapLogStatus === swapLogStatusNew
        && swapLogs === swapLogsNew
        && chainId === chainIdNew
        && account === accountNew
      ),

  );
};

export default useHistoricalTransactions;
