import { Swap } from '@airswap/libraries';
import { getTokenInfo, TokenInfo } from '@airswap/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { NftContract } from 'alchemy-sdk';
import { ethers } from 'ethers';

interface GetCurrencyTokenInfoParams {
  currencyToken: string;
  library: ethers.providers.BaseProvider;
  chainId?: number;
}

export const getCurrencyTokenInfo = createAsyncThunk<
TokenInfo,
GetCurrencyTokenInfoParams
>('metadata/getCurrencyTokenInfo', ({ currencyToken, library }) => (
  getTokenInfo(library, currencyToken)
));

export const getProtocolFee = async (
  chainId: number,
  provider: ethers.providers.BaseProvider,
): Promise<number> => {
  const protocolFee = await Swap.getContract(provider, chainId).protocolFee();
  return protocolFee.toNumber();
};

export const getCollectionContractMetadata = createAsyncThunk<
NftContract,
string
>('metadata/getCollectionContractMetadata', async (collectionToken: string) => (
  alchemy.nft.getContractMetadata(collectionToken)
));
