import { BaseProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { Address, EnsAddressesMap } from '../../../entities/Address/Address';
import { transformAddressesToEnsAddressesMap, transformToAddress } from '../../../entities/Address/AddressTransformers';
import { getEnsNames } from '../../../helpers/ens';
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

const getEnsNamesForAddresses = async (provider: BaseProvider, addresses: string[], ensAddresses: EnsAddressesMap): Promise<(string | null)[]> => {
  if (addresses.some(address => !(address in ensAddresses))) {
    return getEnsNames(addresses, provider);
  }

  return addresses.map(address => ensAddresses[address]);
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

  const responses = await getEnsNamesForAddresses(provider, newOwners, ensAddresses);

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
