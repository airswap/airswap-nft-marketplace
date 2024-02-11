import React, {
  FC,
  ReactElement,
  useEffect,
  useRef,
} from 'react';

import { CollectionTokenAttribute } from '@airswap/utils';
import classNames from 'classnames';

import Button from '../../components/Button/Button';
import Dialog from '../../compositions/Dialog/Dialog';
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [showMobileFilters, toggleShowMobileFilters] = useToggle(false);

  const handleTagChange = (tag: string) => {
    if (activeTags.includes(tag)) {
      return onChange(activeTags.filter(activeTag => activeTag !== tag));
    }

    return onChange([...activeTags, tag]);
  };

  const onDialogClose = () => {
    toggleShowMobileFilters(false);
  };

  useEffect(() => {
    if (showMobileFilters) {
      dialogRef.current?.showModal();
      window?.scroll({ top: 0, behavior: 'smooth' });
    }
  }, [showMobileFilters]);

  const containerClassName = classNames('filters-container', {
    'filters-container--show-mobile': showMobileFilters,
  }, className);

  return (
    <div className={containerClassName}>
      <div className="filters-container__header">
        <h2 className="filters-container__title">Filters</h2>

        <Button
          text="Filters"
          onClick={toggleShowMobileFilters}
          className="filters-container__mobile-button"
        />
      </div>

      <TagFilters
        tagOptions={tagOptions}
        onChange={handleTagChange}
        className="filters-container__tag-filters"
      />

      {showMobileFilters && (
        <Dialog
          label="Filters"
          ref={dialogRef}
          onClose={onDialogClose}
          className="filters-container__mobile-dialog"
        >
          <TagFilters
            tagOptions={tagOptions}
            onChange={handleTagChange}
            className="filters-container__mobile-tag-filters"
          />
        </Dialog>
      )}
    </div>
  );
};

export default FiltersContainer;
