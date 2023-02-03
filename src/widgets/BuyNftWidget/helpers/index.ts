import { TradeNftDetailsProps } from '../../../components/TradeNftDetails/TradeNftDetails';
import { BuyNftState } from '../BuyNftWidget';

export const getNftDetailsIcon = (state: BuyNftState): TradeNftDetailsProps['icon'] => {
  if (state === BuyNftState.success) {
    return 'success';
  }

  if (state === BuyNftState.failed) {
    return 'failed';
  }

  return undefined;
};
