import {
  CancelOrderTransaction,
  Erc20ApprovalTransaction,
  NftApprovalTransaction,
  OrderTransaction,
  SubmittedTransaction,
} from './SubmittedTransaction';

export const isNftApprovalTransaction = (transaction: SubmittedTransaction): transaction is NftApprovalTransaction => transaction.type === 'nft-approval';
export const isErc20ApprovalTransaction = (transaction: SubmittedTransaction): transaction is Erc20ApprovalTransaction => transaction.type === 'erc20-approval';
export const isOrderTransaction = (transaction: SubmittedTransaction): transaction is OrderTransaction => transaction.type === 'order';
export const isCancelOrderTransaction = (transaction: SubmittedTransaction): transaction is CancelOrderTransaction => transaction.type === 'cancel-order';
