import { useEffect, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/types';

import { getCollectionToken, isCollectionTokenInfo } from '../entities/CollectionToken/CollectionTokenHelpers';
import { AppError, isAppError } from '../errors/appError';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addCollectionTokenInfo } from '../redux/stores/metadata/metadataActions';
import useWeb3ReactLibrary from './useWeb3ReactLibrary';

const useCollectionToken = (address: string, tokenId: string): [CollectionTokenInfo | undefined, boolean, AppError | undefined] => {
  const dispatch = useAppDispatch();
  const { library } = useWeb3ReactLibrary();
  const { collectionTokens } = useAppSelector(state => state.metadata);

  const [isContractCalled, setIsContractCalled] = useState(false);
  const [isContractLoading, setIsContractLoading] = useState(true);
  const [collectionToken, setCollectionToken] = useState<CollectionTokenInfo>();
  const [error, setError] = useState<AppError>();
  const collectionTokenFromStore = collectionTokens[tokenId];

  useEffect((): void => {
    setIsContractCalled(false);
    setCollectionToken(undefined);
  }, [tokenId]);

  useEffect((): void => {
    if (!library || isContractCalled || collectionTokenFromStore) {
      return;
    }

    const callGetCollectionToken = async () => {
      const result = await getCollectionToken(library, address, tokenId);

      if (isCollectionTokenInfo(result)) {
        dispatch(addCollectionTokenInfo([result]));
        setCollectionToken(result);
      }

      if (isAppError(result)) {
        setError(result);
      }

      setIsContractLoading(false);
    };

    setError(undefined);
    setIsContractCalled(true);
    setIsContractLoading(true);
    callGetCollectionToken();
  }, [
    library,
    address,
    tokenId,
    isContractCalled,
  ]);

  if (collectionTokenFromStore) {
    return [collectionTokenFromStore, false, undefined];
  }

  return [collectionToken, isContractLoading, error];
};

export default useCollectionToken;
