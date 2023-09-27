import { useEffect } from 'react';

import useDefaultLibrary from '../../../hooks/useDefaultProvider';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProtocolFee } from './metadataActions';
import { getCurrencyTokenInfo } from './metadataApi';
import { setCollectionTokens } from './metadataSlice';
import { getLocalStorageCollectionTokens } from './metdataHelpers';

export const useMetadata = (): void => {
  const dispatch = useAppDispatch();

  const { chainId, collectionToken, currencyToken } = useAppSelector(state => state.config);
  const library = useDefaultLibrary(chainId);

  useEffect(() => {
    dispatch(setCollectionTokens(getLocalStorageCollectionTokens(collectionToken)));
  }, [collectionToken]);

  useEffect(() => {
    if (!library || !chainId) {
      return;
    }

    dispatch(getCurrencyTokenInfo({
      currencyToken,
      library,
      chainId,
    }));

    dispatch(fetchProtocolFee({
      provider: library,
      chainId,
    }));
  }, [library]);
};
