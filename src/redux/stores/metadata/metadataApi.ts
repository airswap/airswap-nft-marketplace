import { SwapERC20 } from '@airswap/libraries';
import { getTokenInfo } from '@airswap/metadata';
import { TokenInfo } from '@airswap/types';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
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
  provider: Web3Provider,
): Promise<number> => {
  const protocolFee = await SwapERC20.getContract(provider, chainId).protocolFee();
  return protocolFee.toNumber();
};
