import { Order } from '@airswap/types';

export enum SubmittedTransactionType {
  erc20Approval = 'erc20-approval',
  nftApproval = 'nft-approval',
  order = 'order',
  cancelOrder = 'cancel-order',
}

export enum SubmittedTransactionStatus {
  processing = 'processing',
  succeeded = 'succeeded',
  failed = 'failed',
}

export interface Transaction {
  type: SubmittedTransactionType;
  hash: string;
  status: SubmittedTransactionStatus;
  timestamp: number;
}

export interface Erc20ApprovalTransaction extends Transaction {
  type: SubmittedTransactionType.erc20Approval,
}

export interface NftApprovalTransaction extends Transaction {
  type: SubmittedTransactionType.nftApproval,
  tokenId: number;
}

export interface OrderTransaction extends Transaction {
  type: SubmittedTransactionType.order,
  order: Order;
}

export interface CancelOrderTransaction extends Transaction {
  type: SubmittedTransactionType.cancelOrder,
  order: Order;
}

export type SubmittedTransaction =
  Erc20ApprovalTransaction
  | NftApprovalTransaction
  | OrderTransaction
  | CancelOrderTransaction;
