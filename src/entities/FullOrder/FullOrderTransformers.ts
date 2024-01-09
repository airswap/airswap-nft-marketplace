import { FullOrder as AirswapFullOrder } from '@airswap/types';

import { FullOrderState } from '../../types/FullOrderState';
import { FullOrder } from './FullOrder';
import { getFullOrderKey } from './FullOrderHelpers';

export const transformToFullOrder = (fullOrder: AirswapFullOrder, state: FullOrderState): FullOrder => ({
  ...fullOrder,
  key: getFullOrderKey(fullOrder),
  state,
});
