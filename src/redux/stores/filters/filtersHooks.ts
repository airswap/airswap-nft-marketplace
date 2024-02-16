import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getTagOptions } from './filtersApi';

export const useFilters = () => {
  const dispatch = useAppDispatch();
  const { collectionToken } = useAppSelector(state => state.config);
  const { isInitialized, urls } = useAppSelector(state => state.indexer);

  useEffect(() => {
    if (isInitialized) {
      dispatch(getTagOptions({ indexerUrls: urls, collectionToken }));
    }
  }, [isInitialized]);
};
