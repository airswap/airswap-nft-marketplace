import { FullOrder } from '@airswap/utils';

import { FullOrderState } from '../../types/FullOrderState';

export interface ExtendedFullOrder extends FullOrder {
  key: string;
  state: FullOrderState;
}
