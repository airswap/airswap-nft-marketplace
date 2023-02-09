import { getTokenFromContract as airswapGetTokenFromContract } from '@airswap/metadata';
import { TokenInfo } from '@airswap/typescript';
import * as ethers from 'ethers';

export const getTokenFromContract = (
  address: string,
  provider: ethers.providers.BaseProvider,
  id?: string,
  // eslint-disable-next-line no-async-promise-executor
): Promise<TokenInfo | undefined> => new Promise<TokenInfo | undefined>(async (resolve) => {
  if (!ethers.utils.isAddress(address)) {
    resolve(undefined);
  } else {
    try {
      const tokenInfo = await airswapGetTokenFromContract(provider, address, id);
      resolve(tokenInfo);
    } catch (e) {
      console.error(e);
      resolve(undefined);
    }
  }
});
