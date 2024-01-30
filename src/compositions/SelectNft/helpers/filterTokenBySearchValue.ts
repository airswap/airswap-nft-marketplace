import { CollectionTokenInfo } from '@airswap/utils';

import { filterCollectionTokenBySearchValue } from '../../../entities/CollectionToken/CollectionTokenHelpers';

export const filterTokenBySearchValue = (tokenId: string, searchValue: string, tokenInfo: CollectionTokenInfo[]): boolean => {
  const nft = tokenInfo.find(token => token.id === tokenId);

  if (nft) {
    return filterCollectionTokenBySearchValue(nft, searchValue);
  }

  return tokenId.includes(searchValue.toLowerCase());
};
