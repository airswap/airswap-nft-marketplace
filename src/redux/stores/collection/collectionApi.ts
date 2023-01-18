import { Web3Provider } from '@ethersproject/providers';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';

const erc721Interface = new ethers.utils.Interface(ERC721.abi);

const getContract = (address: string, provider: Web3Provider) => new ethers.Contract(address, erc721Interface, provider);

export const fetchNFTMetadata = createAsyncThunk(
  'collection/fetchNFTMetadata',
  async () => {
    const { collection, web3, config } = store.getState();
    const { tokenIds, index } = collection;
    const { chainId } = web3;
    const { collectionToken } = config;

    if (!chainId) return;
    console.log('fetchNFTMetadata: after chain');
    const library = getLibrary(web3.chainId as number);
    const collectionContract = getContract(collectionToken, library);

    const CHUNK_SIZE = 20;
    const tokensToFetch = tokenIds.slice(
      index,
      index + CHUNK_SIZE,
    );

    try {
      const dataPromises = tokensToFetch.map(async (tokenId) => {
        const tokenURI = await collectionContract.tokenURI(tokenId);
        const res = await fetch(
          tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'),
        );
        const data = await res.json();

        return data;
      });

      const newTokensData = await Promise.all(dataPromises);
      console.log('fetchNFTMetadata: new tokens data', newTokensData);
      // setTokensData(newTokensData as []);
      store.dispatch({ type: 'collection/setTokensData', payload: newTokensData });
    } catch (err) {
      // TODO
    }

    store.dispatch({ type: 'collection/incrementIndex', payload: CHUNK_SIZE });
  },
);
