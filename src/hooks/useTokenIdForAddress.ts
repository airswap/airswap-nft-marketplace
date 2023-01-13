/* eslint-disable */
import { useEffect, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import { BigNumber, ethers } from 'ethers';

import erc721Abi from '../abis/erc721.json';
import { ipfsToUrl, startsWithIPFS } from '../helpers/ethers';

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

  console.log('ACCOUNT:', account);
  useEffect(() => {
    if (!account || walletAddress) {
      return;
    }

    const contract = new ethers.Contract(collectionURI, erc721Abi, provider);

    contract.balanceOf(account).then((balance: BigNumber) => {
      const count = balance.toNumber();
      console.log(count);
      for (let index = 0; index < count; index + 1) {
        contract.tokenOfOwnerByIndex()
      }
    });


    // contract.tokenURI(tokenId).then((tokenURI: string) => {
    //   axios.get(ipfsToUrl(tokenURI)).then((res) => {
    //     const { data } = res;
    //     if (updateIpfsUrls) {
    //       const values = Object.values(data);
    //       const keys = Object.keys(data);

    //       values.forEach((val, i) => {
    //         if (typeof val === 'string' && startsWithIPFS(val)) {
    //           data[keys[i]] = ipfsToUrl(val);
    //         }
    //       });
    //     }
    //     setMetadata(data);
    //   });
    // });
  }, [collectionURI, provider]);

  return metadata;
};

export default useTokenIdForAddress;
