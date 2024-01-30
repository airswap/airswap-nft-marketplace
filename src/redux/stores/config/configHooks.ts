import { useEffect } from 'react';

import { supportedCollectionTokenKinds, supportedCurrencyTokenKinds } from '../../../constants/supportedTokenKinds';
import useWeb3ReactLibrary from '../../../hooks/useWeb3ReactLibrary';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCollectionTokenKind, getCurrencyTokenKind, getSwapContractAddress } from './configApi';
import { reset } from './configSlice';

export const useConfig = (): void => {
  const dispatch = useAppDispatch();

  const { library, chainId } = useWeb3ReactLibrary();
  const {
    collectionToken,
    collectionTokenKind,
    chainId: configChainId,
    currencyToken,
    currencyTokenKind,
    swapContractAddress,
  } = useAppSelector(state => state.config);

  useEffect(() => {
    if (!library || chainId !== configChainId) {
      return;
    }

    dispatch(getCollectionTokenKind({ address: collectionToken, provider: library }));
    dispatch(getCurrencyTokenKind({ address: currencyToken, provider: library }));
  }, [library?.connection.url, chainId]);

  useEffect(() => {
    dispatch(getSwapContractAddress(configChainId));
  }, [configChainId]);

  useEffect(() => {
    if (
      collectionTokenKind
      && supportedCollectionTokenKinds.includes(collectionTokenKind)
      && currencyTokenKind
      && supportedCurrencyTokenKinds.includes(currencyTokenKind)
    ) {
      // dispatch(setIsSuccessful(true));
    }
  }, [collectionTokenKind, swapContractAddress]);

  useEffect(() => {
    if (chainId !== configChainId) {
      dispatch(reset());
    }
  }, [chainId]);
};
