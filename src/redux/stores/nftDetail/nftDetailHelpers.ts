import { Web3Provider } from '@ethersproject/providers';
import erc721AbiContract from '@openzeppelin/contracts/build/contracts/ERC721.json';
import erc1155Contract from '@openzeppelin/contracts/build/contracts/ERC1155.json';
import { BigNumber, ethers } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';

import { NftTransactionLog } from '../../../entities/NftTransactionLog/NftTransactionLog';
import {
  transformTransactionReceiptToNftTransactionLog,
} from '../../../entities/NftTransactionLog/NftTransactionLogTransformers';
import { getUniqueArrayChildren } from '../../../helpers/array';

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

  const logs = transactionReceipts.map((transactionReceipt, index) => transformTransactionReceiptToNftTransactionLog(
    transactionReceipt,
    transactionReceiptBlocks[index].timestamp,
    transactionReceipt.from,
  )).sort((a, b) => b.timestamp - a.timestamp);

  return getUniqueArrayChildren(logs, 'transactionHash');
};

export const getErc1155Logs = async (
  chainId: number,
  collectionToken: string,
  provider: Web3Provider,
  tokenId: number,
): Promise<NftTransactionLog[]> => {
  const contract = new ethers.Contract(collectionToken, erc1155Contract.abi, provider);
  const transferFilter = contract.filters.TransferSingle(null, null, null, null);

  const events = await contract.queryFilter(transferFilter, 0);
  const transferEvents = events.filter(event => {
    const transferredTokenId: BigNumber | undefined = event.args?.at(3);

    return transferredTokenId?.toString() === tokenId.toString() && event.event === 'TransferSingle';
  });

  const transactionReceipts = await Promise.all(transferEvents.map(event => event.getTransactionReceipt()));
  const transactionReceiptBlocks = await Promise.all(transactionReceipts.map(receipt => provider.getBlock(receipt.blockNumber)));

  const logs = transactionReceipts.map((transactionReceipt, index) => {
    const recipientLogTopics = transactionReceipt.logs[transactionReceipt.logs.length - 1].topics;
    const recipientParam = recipientLogTopics[3];
    const recipient = recipientParam ? defaultAbiCoder.decode(['address'], recipientLogTopics[3]) : [transactionReceipt.from];

    return transformTransactionReceiptToNftTransactionLog(
      transactionReceipt,
      transactionReceiptBlocks[index].timestamp,
      recipient[0],
    );
  }).sort((a, b) => b.timestamp - a.timestamp);

  return getUniqueArrayChildren(logs, 'transactionHash');
};
