import { FullOrder } from '@airswap/types';

import { FullOrderState } from '../../types/FullOrderState';
import { ExtendedFullOrder } from './FullOrder';
import { getFullOrderKey, isFullOrderExpired } from './FullOrderHelpers';

const getFullOrderState = (fullOrder: FullOrder, isTaken: boolean): FullOrderState => {
  const isExpired = isFullOrderExpired(fullOrder);

  if (isTaken) {
    return FullOrderState.taken;
  }

  if (isExpired) {
    return FullOrderState.expired;
  }

  return FullOrderState.open;
};

export const transformToFullOrder = (fullOrder: FullOrder, isTaken: boolean): ExtendedFullOrder => ({
  ...fullOrder,
  key: getFullOrderKey(fullOrder),
  state: getFullOrderState(fullOrder, isTaken),
});

