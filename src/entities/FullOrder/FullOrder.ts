import { FullOrder as AirswapFullOrder } from '@airswap/types';

import { FullOrderState } from '../../types/FullOrderState';

export interface FullOrder extends AirswapFullOrder {
  key: string;
  state: FullOrderState;
}
