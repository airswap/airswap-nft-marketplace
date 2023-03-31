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
  if (state === BuyNftState.confirm) {
    return 'Sign with wallet';
  }

  if (state === BuyNftState.pending) {
    return 'Transaction in progress';
  }

  if (state === BuyNftState.success) {
    return 'Success';
  }

  if (state === BuyNftState.failed) {
    return 'Failed';
  }

  return 'Buy NFT';
};
