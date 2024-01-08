import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { Address, EnsAddressesMap } from '../../../entities/Address/Address';
import { transformAddressesToEnsAddressesMap, transformToAddress } from '../../../entities/Address/AddressTransformers';
import { AppThunkApiConfig } from '../../store';
import { setEnsAddresses } from '../metadata/metadataSlice';

interface GetErc1155OwnerAddressesParams {
  provider: BaseProvider;
  tokenId: string;
}

interface GetErc1155OwnerAddressesPayload {
  owners: Address[];
  pageKey: string;
}

const getEnsAddress = async (provider: BaseProvider, address: string, ensAddresses: EnsAddressesMap) => {
  if (address in ensAddresses) {
    return ensAddresses[address];
  }

  // Note: lookupAddress only seems to work on mainnet.
  return provider.lookupAddress(address);
};

export const getErc1155OwnerAddresses = createAsyncThunk<
GetErc1155OwnerAddressesPayload,
GetErc1155OwnerAddressesParams,
AppThunkApiConfig
>('owners/getErc1155OwnerAddresses', async ({ provider, tokenId }, { getState, dispatch }) => {
  const { collectionToken } = getState().config;
  const { owners, ownersPageKey } = getState().owners;
  const { ensAddresses } = getState().metadata;
  const sales = await alchemy.nft.getOwnersForNft(collectionToken, tokenId, { pageSize: 20, pageKey: ownersPageKey });

  const newOwners: string[] = sales.owners;

  const responses = await Promise.all(newOwners.map(owner => getEnsAddress(provider, owner, ensAddresses)));
  const combinedOwners = [
    ...owners,
    ...newOwners.map((address, index) => transformToAddress(
      address,
      responses[index],
    )),
  ];

  const newEnsAddresses = transformAddressesToEnsAddressesMap(combinedOwners);

  dispatch(setEnsAddresses({
    ...ensAddresses,
    ...newEnsAddresses,
  }));

  return {
    owners: combinedOwners,
    pageKey: sales.pageKey,
  };
});
