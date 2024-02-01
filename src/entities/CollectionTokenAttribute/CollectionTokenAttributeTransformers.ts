import { CollectionTokenAttribute } from '@airswap/utils';

export const transformCollectionTokenAttributeToString = (attribute: CollectionTokenAttribute): string => (
  `${attribute.label}:${attribute.value}`
);
