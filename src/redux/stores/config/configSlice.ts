import { createSlice } from '@reduxjs/toolkit';

export interface ConfigState {
  chainId: number;
  currencyToken: string;
  collectionToken: string;
  collectionName: string;
  collectionImage: string;
  ipfcGatewayURL: string;
}

const initialState: ConfigState = {
  chainId: process.env.REACT_APP_CHAIN_ID ? parseInt(process.env.REACT_APP_CHAIN_ID, 10) : 1,
  currencyToken: (process.env.REACT_APP_CURRENCY_TOKEN || '').toLowerCase(),
  collectionToken: (process.env.REACT_APP_COLLECTION_TOKEN || '').toLowerCase(),
  collectionName: process.env.REACT_APP_COLLECTION_NAME || '',
  collectionImage: process.env.REACT_APP_COLLECTION_IMAGE || '',
  ipfcGatewayURL: process.env.REACT_APP_IPFC_GATEWAY_URL || 'https://ipfs.io/ipfs/',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
});

export default configSlice.reducer;
