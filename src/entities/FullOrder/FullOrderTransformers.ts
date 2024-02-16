import { FullOrder } from '@airswap/utils';

import { FullOrderState } from '../../types/FullOrderState';
import { ExtendedFullOrder } from './FullOrder';
import { getFullOrderKey, isFullOrderExpired } from './FullOrderHelpers';

const getFullOrderState = (fullOrder: FullOrder, isTaken: boolean, isValid: boolean): FullOrderState => {
  const isExpired = isFullOrderExpired(fullOrder);

  if (isTaken) {
    return FullOrderState.taken;
  }

  if (isExpired) {
    return FullOrderState.expired;
  }

  if (!isValid) {
    return FullOrderState.invalid;
  }

  return FullOrderState.open;
};

export const transformToExtendedFullOrder = (fullOrder: FullOrder, isTaken: boolean, isValid: boolean): ExtendedFullOrder => ({
  ...fullOrder,
  key: getFullOrderKey(fullOrder),
  state: getFullOrderState(fullOrder, isTaken, isValid),
});
