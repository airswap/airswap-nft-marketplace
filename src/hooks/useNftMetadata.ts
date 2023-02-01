/* eslint-disable no-debugger */
import { useEffect, useState } from 'react';

import { CollectionToken } from '../entities/CollectionToken/CollectionToken';
import { useAppSelector } from '../redux/hooks';

export const ipfsToUrl: (string: string) => string = (ipfsAddress) => `${process.env.REACT_APP_IPFS_GATEWAY_URL}${ipfsAddress.split('ipfs://')[1]}`;


const useNftMetadata = (
  tokenId: string,
) => {
  const [metadata, setMetadata] = useState<CollectionToken>();
  const { tokensData } = useAppSelector((state) => state.collection);

  useEffect(() => {
    const tokenIndex = tokensData.findIndex((token) => token.id === parseInt(tokenId, 10));
    const tokenData = { ...tokensData[tokenIndex] };
    setMetadata(tokenData);
  }, [tokensData]);

  return metadata;
};

export default useNftMetadata;
