import { TransactionReceipt } from '@ethersproject/providers';
import { NftSale } from 'alchemy-sdk';

import { NftTransactionLog } from './NftTransactionLog';

export const transformTransactionReceiptToNftTransactionLog = (
  transactionReceipt: TransactionReceipt,
  timestamp: number,
  recipient: string,
): NftTransactionLog => ({
  key: `${transactionReceipt.transactionHash}:${transactionReceipt.from}:${transactionReceipt.to}`,
  blockNumber: transactionReceipt.blockNumber,
  to: transactionReceipt.to,
  from: transactionReceipt.from,
  recipient,
  timestamp,
  tokenId: '0',
  transactionHash: transactionReceipt.transactionHash,
});

export const transformNftSalesToNftTransactionLog = (nftSale: NftSale, currentBlockNumber: number): NftTransactionLog => {
  const averageBlockTime = 12.07;
  const blockDifference = currentBlockNumber - nftSale.blockNumber;
  const timestamp = Math.floor(Date.now() / 1000) - (blockDifference * averageBlockTime);

  return {
    key: `${nftSale.transactionHash}:${nftSale.sellerAddress}:${nftSale.buyerAddress}`,
    blockNumber: nftSale.blockNumber,
    to: nftSale.contractAddress,
    from: nftSale.sellerAddress,
    recipient: nftSale.buyerAddress,
    timestamp,
    tokenId: nftSale.tokenId,
    transactionHash: nftSale.transactionHash,
  };
};
