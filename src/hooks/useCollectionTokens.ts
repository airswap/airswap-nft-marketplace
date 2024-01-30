import { useEffect, useMemo, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/utils';

import { getCollectionToken, isCollectionTokenInfo } from '../entities/CollectionToken/CollectionTokenHelpers';
import { AppError, isAppError } from '../errors/appError';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addCollectionTokenInfo } from '../redux/stores/metadata/metadataActions';
import { addGetNftMetadataFailedToast } from '../redux/stores/toasts/toastsActions';
import useDefaultLibrary from './useDefaultProvider';

const useCollectionTokens = (address: string, tokenIds: string[]): [CollectionTokenInfo[], boolean, AppError | undefined] => {
  const { chainId } = useAppSelector((state) => state.config);
  const { metadata } = useAppSelector(state => state);

  const dispatch = useAppDispatch();
  const library = useDefaultLibrary(chainId);

  const [isContractCalled, setIsContractCalled] = useState(false);
  const [isContractLoading, setIsContractLoading] = useState(true);
  const [collectionTokens, setCollectionTokens] = useState<CollectionTokenInfo[]>([]);
  const [error, setError] = useState<AppError>();

  const collectionTokensFromStore = useMemo(() => tokenIds
    .filter(tokenId => !!metadata.collectionTokens[tokenId])
    .map(tokenId => metadata.collectionTokens[tokenId]), [tokenIds, metadata.collectionTokens]);
  const tokenIdsToFetch = tokenIds.filter(tokenId => !metadata.collectionTokens[tokenId]);

  useEffect((): void => {
    setIsContractCalled(false);
    setCollectionTokens([]);
  }, [tokenIds.length]);

  useEffect((): void => {
    if (!library || isContractCalled || !tokenIdsToFetch.length) {
      return;
    }

    const callGetCollectionToken = async () => {
      const results = await Promise.all(tokenIdsToFetch.map(tokenId => getCollectionToken(library, address, tokenId)));
      const newError = results.find(isAppError);

      if (newError) {
        setError(newError);
        dispatch(addGetNftMetadataFailedToast(newError.argument));
      }

      const newCollectionTokens = results.filter(isCollectionTokenInfo);

      dispatch(addCollectionTokenInfo(newCollectionTokens));

      setCollectionTokens(newCollectionTokens);
      setIsContractLoading(false);
    };

    setIsContractCalled(true);
    setIsContractLoading(true);
    callGetCollectionToken();
  }, [
    library,
    address,
    tokenIdsToFetch,
    isContractCalled,
  ]);

  if (!tokenIdsToFetch.length) {
    return [collectionTokensFromStore, false, error];
  }

  return [[...collectionTokensFromStore, ...collectionTokens], isContractLoading, error];
};

export default useCollectionTokens;
