import { createSlice } from '@reduxjs/toolkit';

export interface ConfigState {
  chainId: number;
  currencyToken: string;
  collectionToken: string;
  collectionName: string;
  collectionImage: string;
}

const initialState: ConfigState = {
  chainId: process.env.REACT_APP_CHAIN_ID ? parseInt(process.env.REACT_APP_CHAIN_ID, 10) : 1,
  currencyToken: process.env.REACT_APP_CURRENCY_TOKEN || '',
  collectionToken: process.env.REACT_APP_COLLECTION_TOKEN || '',
  collectionName: process.env.REACT_APP_COLLECTION_NAME || '',
  collectionImage: process.env.REACT_APP_COLLECTION_IMAGE || '',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
});

export default configSlice.reducer;
