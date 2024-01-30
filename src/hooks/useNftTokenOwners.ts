import { useLayoutEffect, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/utils';

import { getCollectionTokenOwners } from '../entities/CollectionToken/CollectionTokenHelpers';
import { useAppSelector } from '../redux/hooks';
import useDefaultProvider from './useDefaultProvider';

const useNftTokenOwners = (token: CollectionTokenInfo): [string | undefined, number, boolean] => {
  const { chainId } = useAppSelector((state) => state.config);
  const library = useDefaultProvider(chainId);

  const [owner, setOwner] = useState<string>();
  const [ownersLength, setOwnersLength] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    if (!library) {
      return;
    }

    const callGetCollectionTokenOwner = async () => {
      const result = await getCollectionTokenOwners(library, token);
      setIsLoading(false);
      setOwner(result?.length ? result[0] : undefined);
      setOwnersLength(result?.length || 0);
    };

    callGetCollectionTokenOwner();
  }, [library, token]);

  return [owner, ownersLength, isLoading];
};

export default useNftTokenOwners;
