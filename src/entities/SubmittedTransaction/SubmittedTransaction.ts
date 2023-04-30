import { Order } from '@airswap/types';

export type TransactionType =
  | 'erc20-approval'
  | 'nft-approval'
  | 'order'
  | 'cancel-order';

export type TransactionStatus =
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'expired';

export interface Transaction {
  type: TransactionType;
  hash: string;
  status: TransactionStatus;
  timestamp: number;
}

export interface Erc20ApprovalTransaction extends Transaction {
  type: 'erc20-approval',
}

export interface NftApprovalTransaction extends Transaction {
  type: 'nft-approval',
  tokenId: number;
}

export interface OrderTransaction extends Transaction {
  type: 'order',
  order: Order;
}

export interface CancelOrderTransaction extends Transaction {
  type: 'cancel-order',
}

export type SubmittedTransaction =
  Erc20ApprovalTransaction
  | NftApprovalTransaction
  | OrderTransaction
  | CancelOrderTransaction;
