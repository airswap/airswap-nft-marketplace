import React, { FC, ReactElement } from 'react';

import { CollectionTokenAttribute } from '@airswap/utils';
import classNames from 'classnames';

import IconButton from '../../compositions/IconButton/IconButton';
import TagFilters from '../../compositions/TagFilters/TagFilters';
import useToggle from '../../hooks/useToggle';

import './FiltersContainer.scss';

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
  const [showMobileFilters, toggleShowMobileFilters] = useToggle(false);

  const handleCloseButtonClick = () => {
    toggleShowMobileFilters();
  };

  const handleTagChange = (tag: string) => {
    if (activeTags.includes(tag)) {
      return onChange(activeTags.filter(activeTag => activeTag !== tag));
    }

    return onChange([...activeTags, tag]);
  };

  const containerClassName = classNames('filters-container', {
    'filters-container--show-mobile': showMobileFilters,
  }, className);

  return (
    <div className={containerClassName}>
      <div className="filters-container__header">
        <h2 className="filters-container__title">Filters</h2>

        <IconButton
          hideLabel
          icon="close"
          text="Close"
          onClick={handleCloseButtonClick}
          className="filters-container__close-button"
        />
      </div>

      <TagFilters
        tagOptions={tagOptions}
        onChange={handleTagChange}
        className="filters-container__tag-filters"
      />
    </div>
  );
};

export default FiltersContainer;
