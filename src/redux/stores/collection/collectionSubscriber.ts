import { ADDRESS_ZERO } from '@airswap/constants';
import { Web3Provider } from '@ethersproject/providers';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { Contract, ethers } from 'ethers';

import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchNFTMetadata } from './collectionApi';

const erc721Interface = new ethers.utils.Interface(ERC721.abi);
const getContract = (address: string, provider: Web3Provider) => new Contract(address, erc721Interface, provider);

export const configureCollectionSubscriber = async () => {
  const { web3, config } = store.getState();
  const { chainId } = web3;
  const { collectionToken } = config;

  if (!chainId) return;

  const library = getLibrary(chainId);
  const collectionContract = getContract(collectionToken, library);

  const transferFilter = collectionContract.filters.Transfer(ADDRESS_ZERO);
  const events = await collectionContract.queryFilter(transferFilter, 0);
  const tokenIds = events.map((e) => e.args?.at(2));

  store.dispatch({ type: 'collection/setTokenIds', payload: tokenIds });
  store.dispatch(fetchNFTMetadata());
};
