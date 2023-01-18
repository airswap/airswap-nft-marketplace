import { ADDRESS_ZERO } from '@airswap/constants';
import { Web3Provider } from '@ethersproject/providers';
import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { Contract, ethers } from 'ethers';

import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { fetchNFTMetadata } from './collectionApi';
// import { setTokensIds } from './collectionSlice';

const erc721Interface = new ethers.utils.Interface(ERC721.abi);
const getContract = (address: string, provider: Web3Provider) => new Contract(address, erc721Interface, provider);

export const configureCollectionSubscriber = () => {
  const { web3, config } = store.getState();
  const { chainId } = web3;
  const { collectionToken } = config;
  if (!chainId) return;

  const library = getLibrary(web3.chainId as number);
  const collectionContract = getContract(collectionToken, library);

  console.log('collectionContract', collectionContract);
  const transferFilter = collectionContract.filters.Transfer(ADDRESS_ZERO);
  console.log('transferFilter', transferFilter);
  collectionContract.queryFilter(transferFilter, 0).then((events) => {
    const test = events.map((e) => e.args?.at(2));
    console.log('test', test);
    // setTokensIds(test);
    store.dispatch({ type: 'collection/setTokenIds', payload: test });
    store.dispatch(fetchNFTMetadata());
  });
};
