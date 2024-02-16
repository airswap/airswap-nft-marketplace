import { OrderFilter as AirswapOrderFilter } from '@airswap/utils';

import { OrderFilter } from './OrderFilter';

export const transformOrderFilterToAirswapOrderFilter = (orderFilter: OrderFilter): AirswapOrderFilter => {
  const {
    chainId,
    signerWallet,
    signerToken,
    signerId,
    senderWallet,
    senderToken,
    tags,
  } = orderFilter;

  return {
    chainId,
    signerWallet,
    signerToken,
    signerId,
    senderWallet,
    senderToken,
    tags,
  };
};
