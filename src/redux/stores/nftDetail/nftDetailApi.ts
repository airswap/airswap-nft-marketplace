import { FullOrder } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { setTokenId } from './nftDetailSlice';

export const getNftOrderByTokenId = createAsyncThunk<
FullOrder | undefined,
number,
AppThunkApiConfig
>('nftDetail/getNftOrderByTokenId', async (tokenId, { dispatch, getState }) => {
  const { config, indexer } = getState();

  dispatch(setTokenId(tokenId));

  const orders = await getOrdersFromIndexers(
    {
      signerTokens: [config.collectionToken],
      offset: 0,
      limit: 999,
    },
    indexer.urls,
  );

  return orders.find((order) => order.signer.id === tokenId.toString());
});
