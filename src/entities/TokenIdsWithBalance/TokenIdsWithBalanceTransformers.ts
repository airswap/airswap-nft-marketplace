import { OwnedNft } from 'alchemy-sdk';

import { TokenIdsWithBalance } from './TokenIdsWithBalance';

export const transformTokensToTokenIdsWithBalance = (tokens: string[]): TokenIdsWithBalance => tokens
  .sort((a, b) => +a - +b)
  .reduce((acc: TokenIdsWithBalance, tokenId: string) => {
    acc[tokenId] = '1';

    return acc;
  }, {});

export const transformOwnedNftsToTokenIdsWithBalance = (ownedNfts: OwnedNft[]): TokenIdsWithBalance => ownedNfts
  .reduce((acc: TokenIdsWithBalance, ownedNft: OwnedNft) => {
    acc[ownedNft.tokenId] = ownedNft.balance;

    return acc;
  }, {});
