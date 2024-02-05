import { FC, ReactElement } from 'react';

import FiltersContainer from '../../containers/FiltersContainer/FiltersContainer';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setActiveTags } from '../../redux/stores/filters/filtersSlice';

interface ConnectedFiltersProps {
  className?: string;
}

const ConnectedFilters: FC<ConnectedFiltersProps> = ({ className = '' }): ReactElement => {
  const dispatch = useAppDispatch();

  const { activeTags, tagOptions } = useAppSelector(state => state.filters);

  const handleFiltersChange = (values: string[]) => {
    dispatch(setActiveTags(values));
  };

  return (
    <FiltersContainer
      activeTags={activeTags}
      tagOptions={tagOptions}
      onChange={handleFiltersChange}
      className={className}
    />
  );
};

export default ConnectedFilters;
