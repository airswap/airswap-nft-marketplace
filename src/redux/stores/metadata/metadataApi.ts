import { SwapERC20 } from '@airswap/libraries';
import { getTokenFromContract } from '@airswap/metadata';
import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

interface ScrapeTokensParams {
  currencyToken: string;
  collectionToken: string;
  library: ethers.providers.BaseProvider;
  chainId?: number;
}

export const getCurrencyAndCollectionTokenInfo = createAsyncThunk<(
TokenInfo | undefined)[], ScrapeTokensParams>(
  'metadata/getTokenFromContract',
  async ({
    currencyToken,
    collectionToken,
    library,
  }) => Promise.all([currencyToken, collectionToken].map(token => (
    getTokenFromContract(library, token, token === collectionToken ? '1' : undefined)))),
  );

export const getProtocolFee = async (
  chainId: number,
  provider: Web3Provider,
): Promise<number> => {
  const protocolFee = await new SwapERC20(
    chainId,
    provider.getSigner(),
  ).contract.protocolFee();
  return protocolFee.toNumber();
};
