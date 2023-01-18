import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { ethers } from 'ethers';

import { ipfsToUrl, startsWithIPFS } from '../helpers/ethers';

export type Metadata = {
  name: string;
  image: string;
  description: string;
  [key: string]: any;
};

const useNftMetadata = (
  collectionURI?: string,
  tokenId?: string,
  updateIpfsUrls = true,
) => {
  const [metadata, setMetadata] = useState<Metadata>();
  const { active, library: provider } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (!collectionURI || !active) {
      return;
    }
    const contract = new ethers.Contract(collectionURI, ERC721.abi, provider);
    contract.tokenURI(tokenId).then((tokenURI: string) => {
      axios.get(ipfsToUrl(tokenURI)).then((res) => {
        const { data } = res;
        if (updateIpfsUrls) {
          const values = Object.values(data);
          const keys = Object.keys(data);

          values.forEach((val, i) => {
            if (typeof val === 'string' && startsWithIPFS(val)) {
              data[keys[i]] = ipfsToUrl(val);
            }
          });
        }
        setMetadata(data);
      });
    });
  }, [collectionURI, provider]);

  return metadata;
};

export default useNftMetadata;
