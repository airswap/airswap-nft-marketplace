/* eslint-disable */
import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { BigNumber, errors, ethers } from 'ethers';

import erc721Abi from '../abis/erc721.json';
import { ipfsToUrl, startsWithIPFS } from '../helpers/ethers';
import useNftMetadata from './useNftMetadata';

type TokenMetadata = {
  name: string;
  image: string;
  description: string;
  [key:string]: any
}
type Metadata = TokenMetadata[];

const useTokenIdForAddress = (collectionURI: string, walletAddress?: string, updateIpfsUrls = true) => {
  const [metadata, setMetadata] = useState<Metadata>();
  const { library: provider, account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (!account || walletAddress) {
      return;
    }

    const contract = new ethers.Contract(collectionURI, erc721Abi, provider);

    contract.balanceOf(account).then((balance: BigNumber) => {
      const count = balance.toNumber();
      for (let index = 0; index < count; index++) {
        contract.tokenOfOwnerByIndex(account, index).then((bigTokenId: BigNumber) => {
          const tokenId = bigTokenId.toString();
          useNftMetadata(collectionURI, tokenId);
          let tokenMetadata: TokenMetadata = {
            name: "",
            image: "",
            description: ""
          };
          if (metadata) {
            setMetadata([ ...metadata, tokenMetadata ])
          } else {
            setMetadata([ tokenMetadata ])
          }
        }).catch((err: errors) => {
          // TODO: Error handling
          console.log(err);
        });
      }
    });
  }, [collectionURI, provider]);

  return metadata;
};

export default useTokenIdForAddress;
