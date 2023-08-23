import { TokenKinds } from '@airswap/constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { AppThunkApiConfig } from '../../store';
import { getCollectionTokenKindHelper, getCurrencyTokenKindHelper } from './configHelpers';

interface GetTokenKindParams {
  address: string,
  provider: ethers.providers.Web3Provider,
}

export const getCollectionTokenKind = createAsyncThunk<
TokenKinds | undefined,
GetTokenKindParams,
AppThunkApiConfig
>('config/getCollectionTokenKind', async ({ address, provider }) => (
  getCollectionTokenKindHelper(provider, address)
));

export const getCurrencyTokenKind = createAsyncThunk<
TokenKinds | undefined,
GetTokenKindParams,
AppThunkApiConfig
>('config/getCurrencyTokenKind', async ({ address, provider }) => (
  getCurrencyTokenKindHelper(provider, address)
));
