import { Web3Provider } from '@ethersproject/providers';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { ethers } from 'ethers';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import {
  transformTransactionReceiptToNftTransactionLog,
} from '../../../entities/NftTransactionLog/NftTransactionLogTransformers';

export const getErc721Logs = async (
  chainId: number,
  collectionToken: string,
  provider: Web3Provider,
  tokenId: number,
): Promise<NftTransactionLog[]> => {
  const contract = new ethers.Contract(collectionToken, erc721AbiContract.abi, provider);
  const transferFilter = contract.filters.Transfer(null, null, tokenId);

  const events = await contract.queryFilter(transferFilter, 0);

  const transactionReceipts = await Promise.all(events.map(event => event.getTransactionReceipt()));
  const transactionReceiptBlocks = await Promise.all(transactionReceipts.map(receipt => provider.getBlock(receipt.blockNumber)));

  return transactionReceipts.map((transactionReceipt, index) => transformTransactionReceiptToNftTransactionLog(
    transactionReceipt,
    transactionReceiptBlocks[index].timestamp,
  ));
};
