import { useEffect, useMemo, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/types';

import { getCollectionToken } from '../entities/CollectionToken/CollectionTokenHelpers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addCollectionTokenInfo } from '../redux/stores/metadata/metadataActions';
import useDefaultLibrary from './useDefaultProvider';

const useCollectionTokens = (address: string, tokenIds: string[]): [CollectionTokenInfo[], boolean] => {
  const { chainId } = useAppSelector((state) => state.config);
  const { metadata } = useAppSelector(state => state);

  const dispatch = useAppDispatch();
  const library = useDefaultLibrary(chainId);

  const [isContractCalled, setIsContractCalled] = useState(false);
  const [isContractLoading, setIsContractLoading] = useState(true);
  const [collectionTokens, setCollectionTokens] = useState<CollectionTokenInfo[]>([]);

  const collectionTokensFromStore = useMemo(() => tokenIds
    .filter(tokenId => !!metadata.collectionTokens[tokenId])
    .map(tokenId => metadata.collectionTokens[tokenId]), [tokenIds, metadata.collectionTokens]);
  const tokenIdsToFetch = tokenIds.filter(tokenId => !metadata.collectionTokens[tokenId]);

  useEffect((): void => {
    setIsContractCalled(false);
    setCollectionTokens([]);
  }, [tokenIds]);

  useEffect((): void => {
    if (!library || isContractCalled || !tokenIdsToFetch.length) {
      return;
    }

    const callGetCollectionToken = async () => {
      const results = await Promise.all(tokenIdsToFetch.map(tokenId => getCollectionToken(library, address, tokenId)));

      results.forEach(result => {
        if (result) {
          dispatch(addCollectionTokenInfo(result));
        }
      });

      const newCollectionTokens = results.filter(result => !!result) as CollectionTokenInfo[];
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
    return [collectionTokensFromStore, false];
  }

  return [[...collectionTokensFromStore, ...collectionTokens], isContractLoading];
};

export default useCollectionTokens;
