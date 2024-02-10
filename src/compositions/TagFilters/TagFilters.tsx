import { FC, memo, ReactElement } from 'react';

import { CollectionTokenAttribute } from '@airswap/utils';

import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import { getTagFilterGroups } from './helpers';

import './TagFilters.scss';

interface TagFiltersProps {
  tagOptions: CollectionTokenAttribute[];
  onChange: (value: string) => void;
  className?: string;
}

const TagFilters: FC<TagFiltersProps> = ({ tagOptions, onChange, className = '' }): ReactElement => {
  const groups = getTagFilterGroups(tagOptions);

  return (
    <form className={`tag-filters ${className}`}>
      {groups.map(group => (
        <CheckboxGroup
          checkboxes={group.options.map(tagOption => ({
            key: `${tagOption.value}`,
            label: tagOption.label,
            value: `${tagOption.value}`,
            onChange,
          }))}
          label={group.label}
          className="tag-filters__group"
        />
      ))}
    </form>
  );
};

export default memo(TagFilters);
