import React, {
  FC,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { CollectionTokenAttribute } from '@airswap/utils';
import classNames from 'classnames';

import Button from '../../components/Button/Button';
import Dialog from '../../compositions/Dialog/Dialog';
import MobileFilterButtons from '../../compositions/MobileFilterButtons/MobileFilterButtons';
import TagFilters from '../../compositions/TagFilters/TagFilters';

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

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobileFiltersClosing, setIsMobileFiltersClosing] = useState(false);

  const handleTagChange = (tag: string) => {
    if (activeTags.includes(tag)) {
      return onChange(activeTags.filter(activeTag => activeTag !== tag));
    }

    return onChange([...activeTags, tag]);
  };

  const onDialogClose = () => {
    setShowMobileFilters(false);
    setIsMobileFiltersClosing(false);
  };

  const onMobileButtonClick = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const handleMobileFiltersCloseButtonClick = () => {
    setIsMobileFiltersClosing(true);
  };

  const handleResetButtonClick = () => {
    onChange([]);
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
          onClick={onMobileButtonClick}
          className="filters-container__mobile-button"
        />
      </div>

      <TagFilters
        activeValues={activeTags}
        options={tagOptions}
        onChange={handleTagChange}
        className="filters-container__tag-filters"
      />

      {showMobileFilters && (
        <Dialog
          isClosing={isMobileFiltersClosing}
          label="Filters"
          ref={dialogRef}
          onClose={onDialogClose}
          className="filters-container__mobile-dialog"
        >
          <TagFilters
            activeValues={activeTags}
            options={tagOptions}
            onChange={handleTagChange}
            className="filters-container__mobile-tag-filters"
          />

          <MobileFilterButtons
            amountOfFilters={activeTags.length}
            onCloseButtonClick={handleMobileFiltersCloseButtonClick}
            onResetFiltersButtonClick={handleResetButtonClick}
            className="filters-container__mobile-filter-buttons"
          />
        </Dialog>
      )}
    </div>
  );
};

export default FiltersContainer;
