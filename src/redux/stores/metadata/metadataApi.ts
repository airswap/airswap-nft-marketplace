import { getTokenFromContract } from '@airswap/metadata';
import { TokenInfo } from '@airswap/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { wait } from '../../../helpers/tools';

interface ScrapeTokensParams {
  currencyToken: string;
  collectionToken: string;
  library: ethers.providers.BaseProvider;
  chainId?: number;
}

export const getCurrencyAndCollectionTokenInfo = createAsyncThunk<(
TokenInfo | undefined)[], ScrapeTokensParams>(
  'metadata/getTokenFromContract',
  async ({
    currencyToken,
    collectionToken,
    library,
    chainId,
  }) => Promise.all([currencyToken, collectionToken].map((token, index) => {
    // On testnet we need to throttle calls or else we risk getting 429;
    const delay = (chainId !== 1 && index > 0) ? 1000 : 0;
    // TODO: Check if irregular token id's (https://github.com/airswap/airswap-marketplace/issues/49)
    const tokenId = token === collectionToken ? '1' : undefined;

    return wait(delay).then(async () => getTokenFromContract(library, token, tokenId));
  })),
  );
