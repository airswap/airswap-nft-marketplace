import { useEffect } from 'react';

import useDefaultLibrary from '../../../hooks/useDefaultProvider';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProtocolFee } from './metadataActions';
import { getCollectionContractMetadata, getCurrencyTokenInfo } from './metadataApi';
import { setCollectionTokens } from './metadataSlice';
import { getLocalStorageCollectionTokens } from './metdataHelpers';

export const useMetadata = (): void => {
  const dispatch = useAppDispatch();

  const { chainId, collectionToken, currencyToken } = useAppSelector(state => state.config);
  const {
    isLoading,
    bannerImage,
    collectionName,
    currencyTokenInfo,
    protocolFee,
  } = useAppSelector(state => state.metadata);
  const library = useDefaultLibrary(chainId);

  useEffect(() => {
    dispatch(setCollectionTokens(getLocalStorageCollectionTokens(collectionToken)));
  }, [collectionToken]);

  useEffect(() => {
    if (!library || !chainId || isLoading) {
      return;
    }

    if (!currencyTokenInfo) {
      dispatch(getCurrencyTokenInfo({
        currencyToken,
        library,
        chainId,
      }));
    }

    if (!protocolFee) {
      dispatch(fetchProtocolFee({
        provider: library,
        chainId,
      }));
    }

    if (bannerImage === undefined || collectionName === undefined) {
      dispatch(getCollectionContractMetadata(collectionToken));
    }
  }, [library]);
};
