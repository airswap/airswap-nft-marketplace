import { useLayoutEffect, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/types';

import { getCollectionTokenOwner } from '../entities/CollectionToken/CollectionTokenHelpers';
import { useAppSelector } from '../redux/hooks';
import useDefaultProvider from './useDefaultProvider';

const useNftTokenOwners = (token: CollectionTokenInfo): [string[] | undefined, boolean] => {
  const { chainId } = useAppSelector((state) => state.config);
  const library = useDefaultProvider(chainId);

  const [owner, setOwners] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    if (!library) {
      return;
    }

    const callGetCollectionTokenOwner = async () => {
      const result = await getCollectionTokenOwner(library, token);
      setIsLoading(false);
      setOwners(result);
    };

    callGetCollectionTokenOwner();
  }, [library, token]);

  return [owner, isLoading];
};

export default useNftTokenOwners;
