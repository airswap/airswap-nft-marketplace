import { ADDRESS_ZERO } from '@airswap/constants';
import { BigNumber } from 'ethers';

import { store } from '../../store';
import { fetchNFTMetadata, getCollectionContract } from './collectionApi';

export const configureCollectionSubscriber = async () => {
  let contractInitialized = false;

  store.subscribe(async () => {
    if (contractInitialized) return;
    const collectionContract = getCollectionContract();
    if (!collectionContract) return;
    contractInitialized = true;

    const transferFilter = collectionContract.filters.Transfer(ADDRESS_ZERO);
    const events = await collectionContract.queryFilter(transferFilter, 0);
    const tokenIds = events.map((e) => (e.args?.at(2) as BigNumber).toString());

    store.dispatch({ type: 'collection/setTokenIds', payload: tokenIds });
    store.dispatch(fetchNFTMetadata());
  });
};
