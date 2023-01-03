import { createSlice } from '@reduxjs/toolkit';

import config from '../../../config';

interface ConfigState {
  appToken?: string;
  nfts: string[];
}

const initialState: ConfigState = {
  appToken: config.appToken,
  nfts: config.nfts,
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
});

export default configSlice.reducer;
