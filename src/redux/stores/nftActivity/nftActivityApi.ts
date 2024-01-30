import { TokenKinds } from '@airswap/utils';
import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { GetNftSalesResponse, SortingOrder } from 'alchemy-sdk';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import { transformNftSalesToNftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLogTransformers';
import { AppThunkApiConfig } from '../../store';
import { getErc721Logs } from './nftActivityHelpers';

interface GetNftTransactionHistoryParams {
  provider: BaseProvider;
  tokenId: string;
}

interface GetNftTransactionHistoryPayload {
  logs: NftTransactionLog[];
  pageKey?: string | null;
}

export const getNftTransactionReceipts = createAsyncThunk<
GetNftTransactionHistoryPayload,
GetNftTransactionHistoryParams,
AppThunkApiConfig
>('nftActivity/getNftTransactionReceipts', async ({ provider, tokenId }, { getState }) => {
  const { collectionToken, collectionTokenKind } = getState().config;
  const { logs, pageKey } = getState().nftActivity;

  if (collectionTokenKind === TokenKinds.ERC1155) {
    const response: GetNftSalesResponse = await alchemy.nft.getNftSales({
      contractAddress: collectionToken,
      order: SortingOrder.DESCENDING,
      pageKey,
      tokenId: tokenId.toString(),
      limit: 20,
    });
    const blockNumber = await provider.getBlockNumber();
    const { nftSales } = response;

    const newLogs = nftSales
      .map(nftSale => transformNftSalesToNftTransactionLog(nftSale, blockNumber));

    return {
      logs: [...logs, ...newLogs],
      pageKey: response.pageKey,
    };
  }

  const newLogs = await getErc721Logs(
    collectionToken,
    provider,
    tokenId,
  );

  return {
    logs: newLogs,
    pageKey: null,
  };
});
