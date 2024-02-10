import { CollectionTokenAttribute } from '@airswap/utils';

import {
  getCollectionTokenAttributeGroup,
} from '../../../entities/CollectionTokenAttribute/CollectionTokenAttributeHelpers';
import { getUniqueSingleDimensionArray } from '../../../helpers/array';

interface TagFiltersGroup {
  label: string;
  options: CollectionTokenAttribute[];
}

export const getTagFilterGroups = (tagOptions: CollectionTokenAttribute[]): TagFiltersGroup[] => {
  const groups = tagOptions
    .map(getCollectionTokenAttributeGroup)
    .filter(getUniqueSingleDimensionArray)
    // TODO: Remove this before making PR
    .filter((group) => group.indexOf('\\') === -1);

  return groups.map((group) => ({
    label: group,
    options: tagOptions.filter((tagOption) => getCollectionTokenAttributeGroup(tagOption) === group),
  }));
};
