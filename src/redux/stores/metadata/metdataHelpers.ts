import { CollectionTokenInfo } from '@airswap/types';

import { isCollectionTokenInfo } from '../../../entities/CollectionToken/CollectionTokenHelpers';
import { parseJsonObject } from '../../../helpers/json';

export const getCollectionTokensLocalStorageKey = (collectionAddress: string): string => `airswap-marketplace/collection-tokens/${collectionAddress}`;

export const getLocalStorageCollectionTokens = (collectionAddress: string): { [id: number]: CollectionTokenInfo } => {
  const value = localStorage.getItem(getCollectionTokensLocalStorageKey(collectionAddress));
  const parsedObject = value ? parseJsonObject<{ [id: number]: any }>(value) : {};

  if (!Object.values(parsedObject).length) {
    return {};
  }

  const collectionTokens: CollectionTokenInfo[] = Object.values(parsedObject)
    .filter(isCollectionTokenInfo);

  if (!collectionTokens.length) {
    return {};
  }

  return collectionTokens
    .reduce((total, tokenInfo) => ({
      ...total,
      [tokenInfo.id]: tokenInfo,
    }), {});
};
