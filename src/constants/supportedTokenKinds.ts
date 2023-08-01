import { SupportedTokenKind } from '../types/SupportedTokenKind';

export const supportedCollectionTokenKinds: SupportedTokenKind[] = [
  SupportedTokenKind.ERC721Enumerable,
  SupportedTokenKind.ERC721,
  SupportedTokenKind.ERC1155,
];

export const supportedCurrencyTokenKinds: SupportedTokenKind[] = [
  SupportedTokenKind.ERC20,
];


export const supportedTokenKinds = [
  ...supportedCollectionTokenKinds,
  ...supportedCurrencyTokenKinds,
];
