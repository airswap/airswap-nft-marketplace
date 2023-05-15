import { useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchProtocolFee } from './metadataActions';
import { getCurrencyTokenInfo } from './metadataApi';
import { setCollectionTokens } from './metadataSlice';
import { getLocalStorageCollectionTokens } from './metdataHelpers';

export const useMetadata = (): void => {
  const dispatch = useAppDispatch();

  const { library } = useWeb3React<Web3Provider>();
  const { chainId } = useAppSelector(state => state.web3);
  const { collectionToken, currencyToken } = useAppSelector(state => state.config);

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
  }, [chainId]);
};
