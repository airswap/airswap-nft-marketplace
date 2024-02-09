import { FC, ReactElement } from 'react';

import { CollectionTokenAttribute } from '@airswap/utils';

import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';

interface TagFiltersProps {
  tagOptions: CollectionTokenAttribute[];
  onChange: (value: string) => void;
  className?: string;
}

const TagFilters: FC<TagFiltersProps> = ({ tagOptions, onChange, className = '' }): ReactElement => (
  <form className={`tag-filters ${className}`}>
    <CheckboxGroup
      checkboxes={tagOptions.map(tagOption => ({
        key: `${tagOption.value}`,
        label: tagOption.label,
        value: `${tagOption.value}`,
        onChange,
      }))}
      label="Tags"
    />
  </form>
);

export default TagFilters;
