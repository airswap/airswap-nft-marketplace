import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  reducers: {
    setAvatarUrl: (state, action: PayloadAction<string>) => ({
      ...state,
      avatarUrl: action.payload,
    }),
  },
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
  },
});

export const { setAvatarUrl } = userSlice.actions;

export default userSlice.reducer;


