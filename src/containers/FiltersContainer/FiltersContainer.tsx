import { FC, ReactElement } from 'react';

import { CollectionTokenAttribute } from '@airswap/utils';

import TagFilters from '../../compositions/TagFilters/TagFilters';

interface FiltersContainerProps {
  activeTags: string[];
  tagOptions: CollectionTokenAttribute[];
  onChange: (activeTags: string[]) => void;
  className?: string;
}

const FiltersContainer: FC<FiltersContainerProps> = ({
  activeTags,
  tagOptions,
  onChange,
  className = '',
}): ReactElement => {
  const handleChange = (tag: string) => {
    if (activeTags.includes(tag)) {
      return onChange(activeTags.filter(activeTag => activeTag !== tag));
    }

    return onChange([...activeTags, tag]);
  };

  return (
    <div className={`filters-container ${className}`}>
      <TagFilters
        tagOptions={tagOptions}
        onChange={handleChange}
      />
    </div>
  );
};

export default FiltersContainer;
