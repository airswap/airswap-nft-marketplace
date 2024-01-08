import { TokenKinds } from '@airswap/constants';
import { FullOrder } from '@airswap/types';
import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { Address } from '../../../entities/Address/Address';
import { transformToAddress } from '../../../entities/Address/AddressTransformers';
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
        signerId: tokenId.toString(),
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
    const sales = await alchemy.nft.getNftSales({ contractAddress: collectionToken, tokenId: tokenId.toString() });
    const { nftSales } = sales;

    return nftSales.map(transformNftSalesToNftTransactionLog);
  }

  return getErc721Logs(
    collectionToken,
    provider,
    tokenId,
  );
});

interface GetErc1155OwnerAddressesParams {
  provider: BaseProvider;
  tokenId: string;
}

interface GetErc1155OwnerAddressesPayload {
  owners: Address[];
  pageKey: string;
}

export const getErc1155OwnerAddresses = createAsyncThunk<
GetErc1155OwnerAddressesPayload,
GetErc1155OwnerAddressesParams,
AppThunkApiConfig
>('nftDetail/getNftOwnerAddresses', async ({ provider, tokenId }, { getState }) => {
  const { collectionToken } = getState().config;
  const { owners, ownersPageKey } = getState().nftDetail;
  const sales = await alchemy.nft.getOwnersForNft(collectionToken, tokenId, { pageSize: 20, pageKey: ownersPageKey });
  const newOwners: string[] = sales.owners;
  const ensAddresses = await Promise.all(newOwners.map(owner => provider.lookupAddress(owner)));
  const combinedOwners = [
    ...owners,
    ...newOwners.map((address, index) => transformToAddress(
      address,
      ensAddresses[index],
    )),
  ];

  return {
    owners: combinedOwners,
    pageKey: sales.pageKey,
  };
});
