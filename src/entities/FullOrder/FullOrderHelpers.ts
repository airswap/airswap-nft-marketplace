import { FullOrder, TokenInfo } from '@airswap/types';
import { format } from '@greypixel_/nicenumbers';
import { BigNumber } from 'bignumber.js';

export const getFullOrderSenderAmountPlusTotalFees = (fullOrder: FullOrder): BigNumber => {
  const protocolFeePercentage = +fullOrder.protocolFee / 10000;
  const affiliateFeePercentage = +fullOrder.affiliateAmount / 10000;
  const feePercentage = protocolFeePercentage + affiliateFeePercentage;

  return new BigNumber(fullOrder.sender.amount).dividedBy(1 - feePercentage);
};

export const getFullOrderReadableSenderAmountPlusTotalFees = (fullOrder: FullOrder, token: TokenInfo): string => {
  const amount = getFullOrderSenderAmountPlusTotalFees(fullOrder);

  return format(amount, {
    tokenDecimals: token.decimals,
    omitTrailingZeroes: true,
  });
};
