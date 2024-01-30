import { CollectionTokenInfo } from '@airswap/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { EnsAddressesMap } from '../../../entities/Address/Address';
import { AppDispatch, RootState } from '../../store';
import { getProtocolFee } from './metadataApi';
import { setCollectionTokens, setEnsAddresses } from './metadataSlice';

export const fetchProtocolFee = createAsyncThunk<
number,
{
  provider: ethers.providers.BaseProvider;
  chainId: number;
}
>('metadata/fetchProtocolFee', async ({ provider, chainId }) => {
  try {
    return getProtocolFee(chainId, provider);
  } catch {
    console.error('Error getting protocol fee from contract, defaulting to 7.');
    return 7;
  }
});

export const addCollectionTokenInfo = (tokenInfos: CollectionTokenInfo[]) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { collectionTokens } = getState().metadata;

  const newCollectionTokens = tokenInfos.reduce((acc, tokenInfo) => ({
    ...acc,
    [tokenInfo.id]: tokenInfo,
  }), collectionTokens);

  dispatch(setCollectionTokens(newCollectionTokens));
};

export const addEnsAddresses = (newEnsAddresses: EnsAddressesMap) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { ensAddresses } = getState().metadata;

  dispatch(setEnsAddresses({
    ...ensAddresses,
    ...newEnsAddresses,
  }));
};
