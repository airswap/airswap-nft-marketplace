import { Protocols } from '@airswap/constants';
import { Registry } from '@airswap/libraries';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { providers } from 'ethers';

interface FetchIndexerUrlsParams {
  chainId: number,
  provider: providers.Web3Provider,
}

export const fetchIndexerUrls = createAsyncThunk<string[], FetchIndexerUrlsParams>(
  'indexer/fetchIndexerUrls',
  async ({ chainId, provider }) => {
    console.log('fetching urls');
    return Registry.getServerURLs(provider, chainId, Protocols.Indexing);
  },
);
