import { Protocols } from '@airswap/constants';
import { RegistryV4 } from '@airswap/libraries';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

interface InitializeParams {
  chainId: number,
  provider: ethers.providers.BaseProvider,
}

export const initialize = createAsyncThunk<
string[],
InitializeParams
>('indexer/initialize', async ({ chainId, provider }) => (
  RegistryV4.getServerURLs(
    provider,
    chainId,
    Protocols.Storage,
  )
));
