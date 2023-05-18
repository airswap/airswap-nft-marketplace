import { CollectionTokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '../../store';
import { getProtocolFee } from './metadataApi';
import { setCollectionTokens } from './metadataSlice';

export const fetchProtocolFee = createAsyncThunk<
number,
{
  provider: Web3Provider;
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

export const addCollectionTokenInfo = (tokenInfo: CollectionTokenInfo) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
  const { collectionTokens } = getState().metadata;

  dispatch(setCollectionTokens({
    ...collectionTokens,
    [tokenInfo.id]: tokenInfo,
  }));
};
