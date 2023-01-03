import { scrapeToken } from '@airswap/metadata';
import { TokenInfo } from '@airswap/typescript';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { wait } from '../../../helpers/tools';

export const scrapeTokens = createAsyncThunk<TokenInfo[], {
  tokens: string[],
  provider: Web3Provider,
  chainId: number;
}>(
  'metadata/scrapeTokens',
  async ({ tokens, provider, chainId }) => Promise.all(tokens.map((token, index) => {
    // On testnet we need to throttle calls or else we risk getting 429;
    const delay = (chainId !== 1 && index > 0) ? 1250 : 0;
    return wait(delay).then(() => (
      scrapeToken(token, provider)
    ));
  })),
);

