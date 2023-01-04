import { scrapeToken as airSwapScrapeToken } from '@airswap/metadata';
import { TokenInfo } from '@airswap/typescript';
import * as ethers from 'ethers';

const scrapeToken = (
  address: string,
  provider: ethers.providers.BaseProvider | string | null,
  chainId?: number,
  // eslint-disable-next-line no-async-promise-executor,consistent-return
): Promise<TokenInfo | undefined> => new Promise<TokenInfo | undefined>(async (resolve) => {
  if (!ethers.utils.isAddress(address)) {
    // eslint-disable-next-line no-promise-executor-return
    return resolve(undefined);
  }

  try {
    const tokenInfo = await airSwapScrapeToken(address, provider, chainId);
    resolve(tokenInfo);
  } catch (e) {
    console.error(e);
    resolve(undefined);
  }
});

export default scrapeToken;
