import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { SupportedTokenKind } from '../../../types/SupportedTokenKind';
import { AppThunkApiConfig } from '../../store';
import { getCollectionTokenTokenKind, getCurrencyTokenTokenKind } from './configHelpers';

interface GetTokenKindParams {
  address: string,
  provider: ethers.providers.Web3Provider,
}

export const getCollectionTokenKind = createAsyncThunk<
SupportedTokenKind | undefined,
GetTokenKindParams,
AppThunkApiConfig
>('config/getCollectionTokenKind', async ({ address, provider }) => (
  getCollectionTokenTokenKind(provider, address)
));

export const getCurrencyTokenKind = createAsyncThunk<
SupportedTokenKind | undefined,
GetTokenKindParams,
AppThunkApiConfig
>('config/getCurrencyTokenKind', async ({ address, provider }) => (
  getCurrencyTokenTokenKind(provider, address)
));
