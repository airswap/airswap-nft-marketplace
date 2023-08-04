import { TransactionReceipt } from '@ethersproject/providers';

import { NftTransactionLog } from './NftTransactionLog';

export const transformTransactionReceiptToNftTransactionLog = (transactionReceipt: TransactionReceipt, timestamp: number): NftTransactionLog => ({
  timestamp,
  blockNumber: transactionReceipt.blockNumber,
  from: transactionReceipt.from,
  to: transactionReceipt.to,
  tokenId: 0,
  transactionHash: transactionReceipt.transactionHash,
});
