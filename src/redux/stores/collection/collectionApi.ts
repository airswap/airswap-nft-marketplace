import { Web3Provider } from '@ethersproject/providers';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contract, ethers } from 'ethers';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';
import { transformErc721TokenToCollectionToken } from '../../../entities/CollectionToken/CollectionTokenTransformers';
import { Erc721Token } from '../../../entities/Erc721Token/Erc721Token';

export const getCollectionErc721Contract = (library: Web3Provider, token: string): Contract => {
  const erc721Interface = new ethers.utils.Interface(ERC721.abi);

  return new Contract(token, erc721Interface, library);
};

interface fetchNFTMetadataParams {
  library: Web3Provider,
  collectionToken: string,
  startIndex: number,
}

export const fetchNFTMetadata = createAsyncThunk<
CollectionToken[], fetchNFTMetadataParams>(
  'collection/fetchNFTMetadata',
  async ({ library, collectionToken, startIndex }) => {
    // TODO: Add support for ERC-1155
    const collectionContract = getCollectionErc721Contract(library, collectionToken);
    console.log('fetchNFTMetadata');
    if (!collectionContract) {
      throw new Error('No collection contract found');
    }

    const CHUNK_SIZE = 20;
    const tokensToFetch = new Array(CHUNK_SIZE)
      .fill(null)
      .map((value, index) => startIndex + index);

    const dataPromises = tokensToFetch.map(async (tokenId) => {
      const tokenURI = await collectionContract.tokenURI(tokenId);
      const res = await fetch(
        tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'),
      );
      const token = await res.json() as Erc721Token;

      return transformErc721TokenToCollectionToken(
        token,
        tokenId,
        0.154,
      );
    });

    return Promise.all(dataPromises);
  },
);
