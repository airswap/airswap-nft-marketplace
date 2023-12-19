import { TransactionReceipt } from '@ethersproject/providers';
import { NftSale } from 'alchemy-sdk';

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
  tokenId: '0',
  transactionHash: transactionReceipt.transactionHash,
});

export const transformNftSalesToNftTransactionLog = (nftSale: NftSale): NftTransactionLog => ({
  recipient: nftSale.buyerAddress,
  blockNumber: nftSale.blockNumber,
  to: nftSale.contractAddress,
  from: nftSale.sellerAddress,
  tokenId: nftSale.tokenId,
  transactionHash: nftSale.transactionHash,
});
