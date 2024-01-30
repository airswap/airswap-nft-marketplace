import { FullOrder } from '@airswap/utils';
import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getOrdersFromIndexers } from '../../../helpers/indexers';
import { AppThunkApiConfig } from '../../store';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { setTokenId } from './nftDetailSlice';

interface GetNftOrderByTokenIdParams {
  tokenId: string;
  provider: BaseProvider;
}

export const getNftOrderByTokenId = createAsyncThunk<
FullOrder | undefined,
GetNftOrderByTokenIdParams,
AppThunkApiConfig
>('nftDetail/getNftOrderByTokenId', async ({ tokenId, provider }, { dispatch, getState }) => {
  const { indexer } = getState();

  dispatch(setTokenId(tokenId));

  try {
    const orders = await getOrdersFromIndexers(
      {
        signerId: tokenId,
        offset: 0,
        limit: 999,
      },
      indexer.urls,
      provider,
    );

    return orders[0];
  } catch {
    dispatch(addGetOrderFailedToast());

    return undefined;
  }
});
