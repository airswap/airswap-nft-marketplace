import { getTokenFromContract } from '@airswap/metadata';
import { Web3Provider } from '@ethersproject/providers';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TokenInfo } from '@uniswap/token-lists';
import { Contract, ethers } from 'ethers';

import { CollectionToken } from '../../../entities/CollectionToken/CollectionToken';

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

    const CHUNK_SIZE = 20;
    const tokensToFetch = new Array(CHUNK_SIZE)
      .fill(null)
      .map((value, index) => startIndex + index);

    const dataPromises = tokensToFetch.map(async (tokenId) => {
      const tokenInfo: TokenInfo = await getTokenFromContract(library, collectionToken, tokenId.toString());

      const token: CollectionToken = {
        id: tokenId,
        name: (tokenInfo.extensions?.metadata as any).name,
        image: (tokenInfo.extensions?.metadata as any).image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
        description: (tokenInfo.extensions?.metadata as any).description,
        price: 0.154,
      };

      return token;
    });

    return Promise.all(dataPromises);
  },
);
