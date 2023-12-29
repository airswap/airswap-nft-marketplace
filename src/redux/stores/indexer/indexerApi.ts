import { Protocols } from '@airswap/constants';
import { Registry } from '@airswap/libraries';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { AppThunkApiConfig } from '../../store';

interface InitializeParams {
  chainId: number,
  provider: ethers.providers.BaseProvider,
}

export const initialize = createAsyncThunk<
string[],
InitializeParams,
AppThunkApiConfig
>('indexer/initialize', async ({ chainId, provider }, { getState }) => {
  const { config } = getState();
  if (config.storageServerUrl) {
    return [config.storageServerUrl];
  }
  const snavie = await Registry.getServerURLs(
    provider,
    chainId,
    Protocols.Indexing,
  );

  console.log(snavie);

  return snavie;
});
