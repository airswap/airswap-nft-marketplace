import { FullOrder } from '@airswap/types';
import { BigNumber } from 'bignumber.js';

export const getFullOrderSenderAmountPlusTotalFees = (fullOrder: FullOrder): BigNumber => {
  const protocolFeePercentage = +fullOrder.protocolFee / 10000;
  const affiliateFeePercentage = +fullOrder.affiliateAmount / 10000;
  const feePercentage = protocolFeePercentage + affiliateFeePercentage;

  return new BigNumber(fullOrder.sender.amount).dividedBy(1 - feePercentage);
};
