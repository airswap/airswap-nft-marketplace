import { OrderFilter as AirswapOrderFilter, SortField, SortOrder } from '@airswap/types/build/src/server';

export interface OrderFilter {
  chainId?: AirswapOrderFilter['chainId'];
  signerWallet?: AirswapOrderFilter['signerWallet'];
  signerToken?: AirswapOrderFilter['signerToken'];
  signerId?: AirswapOrderFilter['signerId'];
  senderWallet?: AirswapOrderFilter['senderWallet'];
  senderToken?: AirswapOrderFilter['senderToken'];
  offset?: number;
  limit?: number;
  sortField?: SortField;
  sortOrder?: SortOrder;
}
