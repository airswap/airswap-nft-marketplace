import { FullOrder } from '@airswap/types';

import { FullOrderState } from '../../types/FullOrderState';

export interface ExtendedFullOrder extends FullOrder {
  key: string;
  state: FullOrderState;
}
