import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contract, ethers } from 'ethers';

import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';

export const getCollectionContract = (): Contract|null => {
  const erc721Interface = new ethers.utils.Interface(ERC721.abi);
  const { config, web3 } = store.getState();

  if (!web3.chainId) return null;
  const library = getLibrary(web3.chainId);

  return new Contract(config.collectionToken, erc721Interface, library);
};

export const fetchNFTMetadata = createAsyncThunk(
  'collection/fetchNFTMetadata',
  async () => {
    const { collection } = store.getState();
    const { tokenIds, index } = collection;

    const collectionContract = getCollectionContract();
    if (!collectionContract) return;

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
      store.dispatch({ type: 'collection/setTokensData', payload: newTokensData });
    } catch (err) {
      // TODO
    }

    store.dispatch({ type: 'collection/incrementIndex', payload: CHUNK_SIZE });
  },
);
