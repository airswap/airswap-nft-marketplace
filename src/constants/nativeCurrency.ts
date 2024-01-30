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
  // [ChainIds.RSK]: {
  //   chainId: 30,
  //   address: nativeCurrencyAddress,
  //   name: 'RBTC',
  //   decimals: 18,
  //   symbol: 'RBTC',
  //   logoURI: 'images/rbtc-logo.png',
  // },
  // [ChainIds.BSC]: {
  //   chainId: 56,
  //   address: nativeCurrencyAddress,
  //   name: 'BNB',
  //   decimals: 18,
  //   symbol: 'BNB',
  //   logoURI: 'images/bnb-logo.png',
  // },
  // [ChainIds.BSCTESTNET]: {
  //   chainId: 97,
  //   address: nativeCurrencyAddress,
  //   name: 'BNB',
  //   decimals: 18,
  //   symbol: 'BNB',
  //   logoURI: 'images/bnb-logo.png',
  // },
  [ChainIds.POLYGON]: {
    chainId: 137,
    address: nativeCurrencyAddress,
    name: 'MATIC',
    decimals: 18,
    symbol: 'MATIC',
    logoURI: 'images/matic-logo.png',
  },
  [ChainIds.MUMBAI]: {
    chainId: 137,
    address: nativeCurrencyAddress,
    name: 'MATIC',
    decimals: 18,
    symbol: 'MATIC',
    logoURI: 'images/matic-logo.png',
  },
  // [ChainIds.AVALANCHE]: {
  //   chainId: 43113,
  //   address: nativeCurrencyAddress,
  //   name: 'AVAX',
  //   decimals: 18,
  //   symbol: 'AVAX',
  //   logoURI: 'images/avalanche-logo.png',
  // },
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
