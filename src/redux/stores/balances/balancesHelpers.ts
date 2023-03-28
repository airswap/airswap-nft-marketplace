import { BigNumber, ethers } from 'ethers';

export const getUniqueTokensForWallet = (tokenIds: BigNumber[], collectionContract: ethers.Contract, walletAddress: string): number[] => {
  /* get unique values */
  const uniqueTokenIds = [...new Set(tokenIds)];

  /* Get only the owned token ids */
  const ownedTokenIds = uniqueTokenIds.filter(async id => {
    const addr = await collectionContract.ownerOf(id);

    return addr === walletAddress;
  });

  return ownedTokenIds
    .map(t => t.toNumber())
    .sort((a, b) => a - b);
};
