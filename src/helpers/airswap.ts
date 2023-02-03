import { getTokenFromContract as airSwapScrapeToken } from '@airswap/metadata';
import { TokenInfo } from '@airswap/typescript';
import * as ethers from 'ethers';

export const scrapeToken = (
  address: string,
  provider: ethers.providers.BaseProvider,
  // eslint-disable-next-line no-async-promise-executor
): Promise<TokenInfo | undefined> => new Promise<TokenInfo | undefined>(async (resolve) => {
  if (!ethers.utils.isAddress(address)) {
    resolve(undefined);
  } else {
    try {
      const tokenInfo = await airSwapScrapeToken(provider, address);
      resolve(tokenInfo);
    } catch (e) {
      console.error(e);
      resolve(undefined);
    }
  }
});
