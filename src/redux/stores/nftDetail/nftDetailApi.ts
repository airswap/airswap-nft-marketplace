import { TokenKinds } from '@airswap/constants';
import { FullOrder } from '@airswap/types';
import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import { transformNftSalesToNftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLogTransformers';
import { AppThunkApiConfig } from '../../store';
import { getOrdersFromIndexers } from '../indexer/indexerHelpers';
import { addGetOrderFailedToast } from '../toasts/toastsActions';
import { getErc721Logs } from './nftDetailHelpers';
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
        signerToken: config.collectionToken,
        signerId: tokenId,
        offset: 0,
        limit: 999,
      },
      indexer.urls,
    );

    return orders[0];
  } catch {
    dispatch(addGetOrderFailedToast());

    return undefined;
  }
});

interface GetNftTransactionHistoryParams {
  provider: BaseProvider;
  tokenId: string;
}

export const getNftTransactionReceipts = createAsyncThunk<
NftTransactionLog[],
GetNftTransactionHistoryParams,
AppThunkApiConfig
>('nftDetail/getNftTransactionReceipts', async ({ provider, tokenId }, { getState }) => {
  const { collectionToken, collectionTokenKind } = getState().config;

  if (collectionTokenKind === TokenKinds.ERC1155) {
    const sales = await alchemy.nft.getNftSales({ contractAddress: collectionToken, tokenId: tokenId.toString(), limit: 100 });
    const { nftSales } = sales;

    return nftSales.map(transformNftSalesToNftTransactionLog);
  }

  return getErc721Logs(
    collectionToken,
    provider,
    tokenId,
  );
});
