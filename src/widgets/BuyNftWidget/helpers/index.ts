import { TradeNftDetailsProps } from '../../../components/TradeNftDetails/TradeNftDetails';
import { BuyNftState } from '../subcomponents/ConnectedBuyNftWidget/ConnectedBuyNftWidget';

export const getNftDetailsIcon = (state: BuyNftState): TradeNftDetailsProps['icon'] => {
  if (state === BuyNftState.success) {
    return 'success';
  }

  if (state === BuyNftState.failed) {
    return 'failed';
  }

  return undefined;
};

export const getTitle = (state: BuyNftState): string => {
  if (state === BuyNftState.approve) {
    return 'Approve in Wallet';
  }

  if (state === BuyNftState.approving) {
    return 'Transaction in progress';
  }

  if (state === BuyNftState.sign) {
    return 'Sign in Wallet';
  }

  if (state === BuyNftState.buying) {
    return 'Buying in progress';
  }

  if (state === BuyNftState.success) {
    return 'Success';
  }

  if (state === BuyNftState.failed) {
    return 'Failed';
  }

  return 'Buy NFT';
};
