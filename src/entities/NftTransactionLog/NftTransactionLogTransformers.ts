import { TransactionReceipt } from '@ethersproject/providers';

import { NftTransactionLog } from './NftTransactionLog';

export const transformTransactionReceiptToNftTransactionLog = (
  transactionReceipt: TransactionReceipt,
  timestamp: number,
  recipient: string,
): NftTransactionLog => ({
  recipient,
  timestamp,
  blockNumber: transactionReceipt.blockNumber,
  to: transactionReceipt.to,
  from: transactionReceipt.from,
  tokenId: 0,
  transactionHash: transactionReceipt.transactionHash,
});
