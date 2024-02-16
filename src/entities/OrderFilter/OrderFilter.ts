import { OrderFilter as AirswapOrderFilter } from '@airswap/utils';

export interface OrderFilter {
  chainId?: AirswapOrderFilter['chainId'];
  signerWallet?: AirswapOrderFilter['signerWallet'];
  signerToken?: AirswapOrderFilter['signerToken'];
  signerId?: AirswapOrderFilter['signerId'];
  senderWallet?: AirswapOrderFilter['senderWallet'];
  senderToken?: AirswapOrderFilter['senderToken'];
  tags?: AirswapOrderFilter['tags'];
  offset?: number;
  limit?: number;
}
