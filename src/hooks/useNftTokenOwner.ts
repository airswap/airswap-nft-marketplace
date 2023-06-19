import { useLayoutEffect, useState } from 'react';

import { CollectionTokenInfo } from '@airswap/types';

import { getCollectionTokenOwner } from '../entities/CollectionToken/CollectionTokenHelpers';
import { useAppSelector } from '../redux/hooks';
import useDefaultProvider from './useDefaultProvider';

const useNftTokenOwner = (token: CollectionTokenInfo): string | undefined => {
  const { chainId } = useAppSelector((state) => state.config);
  const library = useDefaultProvider(chainId);

  const [owner, setOwner] = useState<string>();

  useLayoutEffect(() => {
    if (!library) {
      return;
    }

    const callGetCollectionTokenOwner = async () => {
      const result = await getCollectionTokenOwner(library, token);
      setOwner(result);
    };

    callGetCollectionTokenOwner();
  }, [library, token]);

  return owner;
};

export default useNftTokenOwner;
