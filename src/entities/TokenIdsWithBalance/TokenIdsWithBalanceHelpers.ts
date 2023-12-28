import { BigNumber } from 'bignumber.js';

import { TokenIdsWithBalance } from './TokenIdsWithBalance';

export const subtractTokenBalance = (tokenIdsWithBalance: TokenIdsWithBalance, tokenIdToSubstract: string): TokenIdsWithBalance => {
  const updatedUserTokens: TokenIdsWithBalance = {
    ...tokenIdsWithBalance,
    [tokenIdToSubstract]: new BigNumber(tokenIdsWithBalance[tokenIdToSubstract]).minus(1).toString(),
  };

  if (updatedUserTokens[tokenIdToSubstract] === '0') {
    delete updatedUserTokens[tokenIdToSubstract];
  }

  return updatedUserTokens;
};
