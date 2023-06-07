import { getAccountUrl } from '@airswap/utils';

export const getOwnedTokensByAccountUrl = (chainId: number, account: string, contract: string): string => {
  const accountUrl = getAccountUrl(chainId, account);
  const [etherScanUrl] = accountUrl.split('/address/');

  return `${etherScanUrl}/token/${contract}?a=${account}`;
};
