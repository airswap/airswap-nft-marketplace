import { useEffect, useState } from 'react';

import { CollectionTokenInfo, TokenKinds } from '@airswap/utils';

import { isCollectionTokenInfo } from '../entities/CollectionToken/CollectionTokenHelpers';
import { getNftTokenApproved } from '../redux/stores/orders/ordersApi';
import useWeb3ReactLibrary from './useWeb3ReactLibrary';

const useNftTokenApproval = (
  tokenInfo: CollectionTokenInfo | undefined,
  tokenId: string,
): boolean => {
  const { library, chainId } = useWeb3ReactLibrary();
  const [isApproved, setIsApproved] = useState(false);

  useEffect((): () => void => {
    let timer: NodeJS.Timeout;

    if (
      !tokenInfo
      || !library
      || !chainId
      || !isCollectionTokenInfo(tokenInfo)
    ) {
      return () => clearTimeout(timer);
    }

    const tokenKind = tokenInfo.kind as TokenKinds;
    if (tokenKind !== TokenKinds.ERC721 && tokenKind !== TokenKinds.ERC1155) {
      console.error('[useNftTokenApproval]: Token is not ERC721 or ERC115');

      return () => clearTimeout(timer);
    }

    const callGetNftTokenApproved = async () => {
      const approved = await getNftTokenApproved(
        tokenInfo.address,
        tokenId,
        library,
        tokenKind,
        chainId,
      );

      setIsApproved(approved);
    };

    timer = setInterval(() => callGetNftTokenApproved(), 1000);

    return () => clearInterval(timer);
  }, [
    tokenInfo,
    tokenId,
    chainId,
    library,
  ]);

  return isApproved;
};

export default useNftTokenApproval;
