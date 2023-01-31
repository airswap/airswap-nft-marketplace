/* eslint-disable no-debugger */
import { useEffect, useState } from 'react';

import { useAppSelector } from '../redux/hooks';

export const ipfsToUrl: (string: string) => string = (ipfsAddress) => `${process.env.REACT_APP_IPFS_GATEWAY_URL}${ipfsAddress.split('ipfs://')[1]}`;

export type Metadata = {
  name: string;
  image: string;
  description: string;
  [key: string]: any;
};

const useNftMetadata = (
  tokenId: string,
) => {
  const [metadata, setMetadata] = useState<Metadata>();
  const { tokensData } = useAppSelector((state) => state.collection);

  useEffect(() => {
    const tokenData = { ...tokensData[parseInt(tokenId, 10)] };
    tokenData.image = ipfsToUrl(tokenData.image);
    setMetadata(tokenData);
  }, [tokensData]);

  return metadata;
};

export default useNftMetadata;
