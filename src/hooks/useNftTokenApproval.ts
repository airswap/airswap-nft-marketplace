import { useEffect, useState } from 'react';

import { TokenKinds } from '@airswap/constants';
import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { getNftTokenApproved } from '../redux/stores/orders/ordersApi';

const useNftTokenApproval = (
  tokenInfo: CollectionTokenInfo | undefined,
  tokenId: number,
): boolean => {
  const { chainId, library } = useWeb3React<Web3Provider>();
  const [isApproved, setIsApproved] = useState(false);

  useEffect((): () => void => {
    let timer: NodeJS.Timeout;

    if (!tokenInfo || !library || !chainId) {
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
