import { CollectionTokenInfo } from '@airswap/types';

import { filterCollectionTokenBySearchValue } from '../../../entities/CollectionToken/CollectionTokenHelpers';

export const filterTokenBySearchValue = (tokenId: string, searchValue: string, tokenInfo: CollectionTokenInfo[]): boolean => {
  const nft = tokenInfo.find(token => token.id.toString() === tokenId);

  if (nft) {
    return filterCollectionTokenBySearchValue(nft, searchValue);
  }

  return tokenId.includes(searchValue.toLowerCase());
};
