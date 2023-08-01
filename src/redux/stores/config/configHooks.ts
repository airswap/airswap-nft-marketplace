import { useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';

import { supportedCollectionTokenKinds, supportedCurrencyTokenKinds } from '../../../constants/supportedTokenKinds';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCollectionTokenKind, getCurrencyTokenKind } from './configApi';
import { reset, setIsSuccessful } from './configSlice';

export const useConfig = (): void => {
  const dispatch = useAppDispatch();

  const { library } = useWeb3React();
  const { chainId } = useAppSelector(state => state.web3);
  const {
    collectionToken,
    collectionTokenKind,
    chainId: configChainId,
    currencyToken,
    currencyTokenKind,
  } = useAppSelector(state => state.config);

  useEffect(() => {
    if (!library || chainId !== configChainId) {
      return;
    }

    dispatch(getCollectionTokenKind({ address: collectionToken, provider: library }));
    dispatch(getCurrencyTokenKind({ address: currencyToken, provider: library }));
  }, [chainId]);

  useEffect(() => {
    if (
      collectionTokenKind
      && supportedCollectionTokenKinds.includes(collectionTokenKind)
      && currencyTokenKind
      && supportedCurrencyTokenKinds.includes(currencyTokenKind)
    ) {
      dispatch(setIsSuccessful(true));
    }
  }, [collectionTokenKind]);

  useEffect(() => {
    if (chainId !== configChainId) {
      dispatch(reset());
    }
  }, [chainId]);
};
