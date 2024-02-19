import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTagOptions } from './filtersApi';

export const useFilters = () => {
  const dispatch = useAppDispatch();

  const { collectionToken } = useAppSelector(state => state.config);
  const { isInitialized, urls } = useAppSelector(state => state.indexer);

  const getOptions = () => {
    dispatch(getTagOptions({ indexerUrls: urls, collectionToken }));
  };

  useEffect(() => {
    if (isInitialized) {
      getOptions();
    }
  }, [isInitialized]);
};
