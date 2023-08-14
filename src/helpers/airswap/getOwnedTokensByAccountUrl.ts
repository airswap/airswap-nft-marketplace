import { getAccountUrl } from '@airswap/utils';

const getOwnedTokensByAccountUrl = (chainId: number, account: string, contract: string): string => {
  const accountUrl = getAccountUrl(chainId, account);
  const [etherScanUrl] = accountUrl.split('/address/');

  return `${etherScanUrl}/tokenholdings/${contract}?a=${account}`;
};

export default getOwnedTokensByAccountUrl;
