import { CollectionTokenInfo } from '@airswap/types';

import { isCollectionTokenInfo } from '../../../entities/CollectionToken/CollectionTokenHelpers';
import { parseJsonObject } from '../../../helpers/json';

export const getCollectionTokensLocalStorageKey = (collectionAddress: string): string => `airswap-marketplace/collection-tokens/${collectionAddress}`;

export const getCollectionImageBannerLocalStorageKey = (collectionAddress: string): string => `airswap-marketplace/collection-token-image-banner/${collectionAddress}`;

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

type LocalStorageCollectionImage = { value: string | null };

export const setLocalStorageCollectionImageBanner = (image: string | null): void => {
  const collectionToken = process.env.REACT_APP_COLLECTION_TOKEN_ADDRESS as string;
  const value: LocalStorageCollectionImage = { value: image };

  localStorage.setItem(getCollectionImageBannerLocalStorageKey(collectionToken), JSON.stringify(value));
};

export const getLocalStorageCollectionImage = (): string | null | undefined => {
  const collectionToken = process.env.REACT_APP_COLLECTION_TOKEN_ADDRESS as string;
  const item = localStorage.getItem(getCollectionImageBannerLocalStorageKey(collectionToken));

  if (!item) {
    return undefined;
  }

  const object = parseJsonObject<LocalStorageCollectionImage>(item);

  return object?.value || null;
};
