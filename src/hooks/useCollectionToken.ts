import { useEffect, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { getCollectionToken } from '../entities/CollectionToken/CollectionTokenHelpers';

const useCollectionToken = (address: string, tokenId: number): [CollectionTokenInfo | undefined, boolean] => {
  const { library } = useWeb3React<Web3Provider>();

  const [isContractCalled, setIsContractCalled] = useState(false);
  const [isContractLoading, setIsContractLoading] = useState(false);
  const [collectionToken, setCollectionToken] = useState<CollectionTokenInfo>();

  useEffect((): void => {
    setIsContractCalled(false);
    setCollectionToken(undefined);
  }, [tokenId]);

  useEffect((): void => {
    if (!library || isContractCalled) {
      return;
    }

    const callGetCollectionToken = async () => {
      const result = await getCollectionToken(library, address, tokenId);

      setCollectionToken(result);
      setIsContractLoading(false);
    };

    setIsContractCalled(true);
    setIsContractLoading(true);
    callGetCollectionToken();
  }, [
    library,
    address,
    tokenId,
    isContractCalled,
  ]);

  return [collectionToken, isContractLoading];
};

export default useCollectionToken;
