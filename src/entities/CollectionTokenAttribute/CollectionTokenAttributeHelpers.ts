import { CollectionTokenAttribute } from '@airswap/utils';

export const getCollectionTokenAttributeGroup = (attribute: CollectionTokenAttribute): string => {
  const [group] = `${attribute.value}`.split(':');

  return group;
};
