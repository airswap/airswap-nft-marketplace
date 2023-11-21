import { FullOrder, TokenInfo } from '@airswap/types';
import { format } from '@greypixel_/nicenumbers';
import { BigNumber } from 'bignumber.js';

export const getFullOrderSenderAmountPlusTotalFees = (fullOrder: FullOrder): BigNumber => {
  const protocolFeePercentage = +fullOrder.protocolFee / 10000;
  const affiliateFeePercentage = +fullOrder.affiliateAmount / 10000;
  const feePercentage = protocolFeePercentage + affiliateFeePercentage;
  const fullAmount = new BigNumber(fullOrder.sender.amount).dividedBy(1 - feePercentage);

  return fullAmount.decimalPlaces(0, BigNumber.ROUND_UP);
};

export const getFullOrderReadableSenderAmountPlusTotalFees = (fullOrder: FullOrder, token: TokenInfo): string => {
  const amount = getFullOrderSenderAmountPlusTotalFees(fullOrder);

  return format(amount, {
    tokenDecimals: token.decimals,
    omitTrailingZeroes: true,
  });
};

export const getFullOrderReadableSenderAmount = (fullOrder: FullOrder, token: TokenInfo): string => format(fullOrder.sender.amount, {
  tokenDecimals: token.decimals,
  omitTrailingZeroes: true,
});

export const getFullOrderExpiryDate = (fullOrder: FullOrder): Date => new Date(+fullOrder.expiry * 1000);
