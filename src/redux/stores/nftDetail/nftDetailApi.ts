import { TokenKinds } from '@airswap/constants';
import { FullOrder } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { getErc721Logs, getErc1155Logs } from './nftDetailHelpers';
import { setTokenId } from './nftDetailSlice';

export const getNftOrderByTokenId = createAsyncThunk<
FullOrder | undefined,
string,
AppThunkApiConfig
>('nftDetail/getNftOrderByTokenId', async (tokenId, { dispatch, getState }) => {
  const { config, indexer } = getState();

  dispatch(setTokenId(tokenId));

  try {
    const orders = await getOrdersFromIndexers(
      {
        signerTokens: [config.collectionToken],
        signerIds: [tokenId.toString()],
        offset: 0,
        limit: 999,
      },
      indexer.urls,
    );

    return orders[orders.length - 1];
  } catch {
    dispatch(addGetOrderFailedToast());

    return undefined;
  }
});

interface GetNftTransactionHistoryParams {
  provider: Web3Provider;
  tokenId: number;
}

export const getNftTransactionReceipts = createAsyncThunk<
NftTransactionLog[],
GetNftTransactionHistoryParams,
AppThunkApiConfig
>('nftDetail/getNftTransactionReceipts', async ({ provider, tokenId }, { getState }) => {
  const { chainId, collectionToken, collectionTokenKind } = getState().config;

  if (collectionTokenKind === TokenKinds.ERC1155) {
    return getErc1155Logs(
      chainId,
      collectionToken,
      provider,
      tokenId,
    );
  }

  return getErc721Logs(
    chainId,
    collectionToken,
    provider,
    tokenId,
  );
});
