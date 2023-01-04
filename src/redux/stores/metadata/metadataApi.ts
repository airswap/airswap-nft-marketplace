import { TokenInfo } from '@airswap/typescript';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import scrapeToken from '../../../helpers/scrapeToken';
import { wait } from '../../../helpers/tools';

interface ScrapeTokensParams {
  tokens: string[];
  library: ethers.providers.BaseProvider | null;
  chainId?: number;
}

export const scrapeTokens = createAsyncThunk<(
TokenInfo | undefined)[], ScrapeTokensParams>(
  'metadata/scrapeTokens',
  async ({ tokens, library, chainId }) => Promise.all(tokens.map((token, index) => {
  // On testnet we need to throttle calls or else we risk getting 429;
    const delay = (chainId !== 1 && index > 0) ? 10000 : 0;
    return wait(delay).then(async () => scrapeToken(token, library, chainId));
  })),
  );

