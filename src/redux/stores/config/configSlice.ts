import { createSlice } from '@reduxjs/toolkit';

export interface ConfigState {
  currencyToken: string;
  collectionToken: string;
  collectionName: string;
  collectionImage: string;
}

const initialState: ConfigState = {
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
