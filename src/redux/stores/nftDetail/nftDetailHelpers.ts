import { BaseProvider } from '@ethersproject/providers';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { ethers } from 'ethers';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import {
  transformTransactionReceiptToNftTransactionLog,
} from '../../../entities/NftTransactionLog/NftTransactionLogTransformers';
import { getUniqueArrayChildren } from '../../../helpers/array';

export const getErc721Logs = async (
  collectionToken: string,
  provider: BaseProvider,
  tokenId: string,
): Promise<NftTransactionLog[]> => {
  const contract = new ethers.Contract(collectionToken, erc721AbiContract.abi, provider);
  const transferFilter = contract.filters.Transfer(null, null, tokenId);

  const events = await contract.queryFilter(transferFilter, 0);

  const transactionReceipts = await Promise.all(events.map(event => event.getTransactionReceipt()));
  const transactionReceiptBlocks = await Promise.all(transactionReceipts.map(receipt => provider.getBlock(receipt.blockNumber)));

  const logs = transactionReceipts.map((transactionReceipt, index) => transformTransactionReceiptToNftTransactionLog(
    transactionReceipt,
    transactionReceiptBlocks[index].timestamp,
    transactionReceipt.from,
  )).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return getUniqueArrayChildren(logs, 'transactionHash');
};
