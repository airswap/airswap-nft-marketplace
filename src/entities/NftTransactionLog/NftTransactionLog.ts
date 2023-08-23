export interface NftTransactionLog {
  blockNumber: number;
  from: string;
  recipient: string;
  timestamp: number,
  to: string;
  tokenId: number;
  transactionHash: string;
}
