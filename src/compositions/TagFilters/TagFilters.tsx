import { FC, memo, ReactElement } from 'react';

import { CollectionTokenAttribute } from '@airswap/utils';

import CheckboxGroup from '../CheckboxGroup/CheckboxGroup';
import { getTagFilterGroups } from './helpers';

import './TagFilters.scss';

interface TagFiltersProps {
  activeValues: string[];
  options: CollectionTokenAttribute[];
  onChange: (value: string) => void;
  className?: string;
}

const TagFilters: FC<TagFiltersProps> = ({
  activeValues,
  options,
  onChange,
  className = '',
}): ReactElement => {
  const groups = getTagFilterGroups(options);

  return (
    <form className={`tag-filters ${className}`}>
      <h3 className="tag-filters__title">Traits</h3>

      {groups.map(group => (
        <CheckboxGroup
          key={group.label}
          checkboxes={group.options.map(tagOption => ({
            key: `${tagOption.value}`,
            checked: activeValues.includes(`${tagOption.value}`),
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
