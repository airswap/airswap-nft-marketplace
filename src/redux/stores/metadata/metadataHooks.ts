import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { setCollectionTokens } from './metadataSlice';
import { getLocalStorageCollectionTokens } from './metdataHelpers';

export const useMetadata = (): void => {
  const dispatch = useAppDispatch();

  const { collectionToken } = useAppSelector(state => state.config);

  useEffect(() => {
    dispatch(setCollectionTokens(getLocalStorageCollectionTokens(collectionToken)));
  }, [collectionToken]);
};
