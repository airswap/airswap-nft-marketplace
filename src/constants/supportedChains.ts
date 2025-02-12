import { ChainIds } from '@airswap/utils';

export const supportedChains = [
  ChainIds.MAINNET,
  ChainIds.POLYGON,
  ChainIds.BASE,
  ChainIds.MUMBAI,
  ChainIds.SEPOLIA,
] as const;

export type SupportedChain = typeof supportedChains[number];
