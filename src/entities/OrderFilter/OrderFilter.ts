import { Direction, Indexes, OrderFilter as AirswapOrderFilter } from '@airswap/types';

export interface OrderFilter {
  chainId?: AirswapOrderFilter['chainId'];
  signerWallet?: AirswapOrderFilter['signerWallet'];
  signerToken?: AirswapOrderFilter['signerToken'];
  signerId?: AirswapOrderFilter['signerId'];
  senderWallet?: AirswapOrderFilter['senderWallet'];
  senderToken?: AirswapOrderFilter['senderToken'];
  offset?: number;
  limit?: number;
  sortField?: Indexes;
  sortOrder?: Direction;
}
