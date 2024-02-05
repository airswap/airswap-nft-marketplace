import { FC, ReactElement } from 'react';

import { CollectionTokenAttribute } from '@airswap/utils';

import Checkbox from '../../components/Checkbox/Checkbox';

interface TagFiltersProps {
  tagOptions: CollectionTokenAttribute[];
  onChange: (value: string) => void;
  className?: string;
}

const TagFilters: FC<TagFiltersProps> = ({ tagOptions, onChange, className = '' }): ReactElement => (
  <form className={`tag-filters ${className}`}>
    {tagOptions.map(tagOption => (
      <Checkbox
        label={tagOption.label}
        value={`${tagOption.value}`}
        onChange={onChange}
      />
    ))}
  </form>
);

export default TagFilters;
