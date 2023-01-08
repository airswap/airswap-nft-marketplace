import { scrapeToken as airSwapScrapeToken } from '@airswap/metadata';
import { TokenInfo } from '@airswap/typescript';
import * as ethers from 'ethers';

export const scrapeToken = (
  address: string,
  provider: ethers.providers.BaseProvider | string | null,
  chainId?: number,
  // eslint-disable-next-line no-async-promise-executor
): Promise<TokenInfo | undefined> => new Promise<TokenInfo | undefined>(async (resolve) => {
  if (!ethers.utils.isAddress(address)) {
    resolve(undefined);
  } else {
    try {
      const tokenInfo = await airSwapScrapeToken(address, provider, chainId);
      resolve(tokenInfo);
    } catch (e) {
      console.error(e);
      resolve(undefined);
    }
  }
});
