import { ChainIds, TokenInfo as AirswapTokenInfo } from '@airswap/utils';

import { SupportedChain } from './supportedChains';

export const nativeCurrencyAddress = '0x0000000000000000000000000000000000000000';

interface TokenInfo extends Partial<AirswapTokenInfo> {
  decimals: 18;
  name: string;
  symbol: string;
}

const nativeCurrency: Record<SupportedChain, TokenInfo> = {
  [ChainIds.MAINNET]: {
    chainId: 1,
    address: nativeCurrencyAddress,
    name: 'Ether',
    decimals: 18,
    symbol: 'ETH',
    logoURI: 'images/ethereum-logo.png',
  },
  [ChainIds.POLYGON]: {
    chainId: 137,
    address: nativeCurrencyAddress,
    name: 'MATIC',
    decimals: 18,
    symbol: 'MATIC',
    logoURI: 'images/matic-logo.png',
  },
  [ChainIds.BASE]: {
    chainId: 1,
    address: nativeCurrencyAddress,
    name: 'Ether',
    decimals: 18,
    symbol: 'ETH',
    logoURI: 'images/ethereum-logo.png',
  },
  [ChainIds.MUMBAI]: {
    chainId: 137,
    address: nativeCurrencyAddress,
    name: 'MATIC',
    decimals: 18,
    symbol: 'MATIC',
    logoURI: 'images/matic-logo.png',
  },
  [ChainIds.SEPOLIA]: {
    chainId: ChainIds.SEPOLIA,
    address: nativeCurrencyAddress,
    name: 'Ether',
    decimals: 18,
    symbol: 'ETH',
    logoURI: 'images/ethereum-logo.png',
  },
};

export default nativeCurrency;
