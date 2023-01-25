import { createSlice } from '@reduxjs/toolkit';

import { setWeb3Data } from '../web3/web3Slice';
import { fetchAvatarByAddress } from './userApi';

export interface UserState {
  isLoading: boolean;
  avatarUrl?: string;
}

const initialState: UserState = {
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAvatarByAddress.pending, (state) => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(fetchAvatarByAddress.fulfilled, (state, action) => ({
      ...state,
      isLoading: false,
      avatarUrl: action.payload,
    }));

    builder.addCase(setWeb3Data, (state, action) => ({
      ...state,
      avatarUrl: action.payload.account ? state.avatarUrl : undefined,
    }));
  },
});

export default userSlice.reducer;


