import { ADDRESS_ZERO } from '@airswap/constants';

import { store } from '../../store';
import { fetchNFTMetadata, getCollectionContract } from './collectionApi';

export const configureCollectionSubscriber = async () => {
  const collectionContract = getCollectionContract();
  if (!collectionContract) return;

  const transferFilter = collectionContract.filters.Transfer(ADDRESS_ZERO);
  const events = await collectionContract.queryFilter(transferFilter, 0);
  const tokenIds = events.map((e) => e.args?.at(2));

  store.dispatch({ type: 'collection/setTokenIds', payload: tokenIds });
  store.dispatch(fetchNFTMetadata());
};
