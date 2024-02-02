import { CollectionTokenAttribute } from '@airswap/utils';

export const transformCollectionTokenAttributeToString = (attribute: CollectionTokenAttribute): string => (
  `${attribute.label}:${attribute.value}`
);

export const transformToCollectionTokenAttribute = (attributeString: string): CollectionTokenAttribute => {
  const [, attribute] = attributeString.split(':');

  return {
    label: attribute,
    value: attributeString,
  };
};
