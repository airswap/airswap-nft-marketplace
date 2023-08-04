export interface NftTransactionLog {
  blockNumber: number;
  from: string;
  timestamp: number,
  to: string;
  tokenId: number;
  transactionHash: string;
}
