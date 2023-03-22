import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getProtocolFee } from './metadataApi';

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
