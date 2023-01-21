import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchAvatarByAddress } from './userApi';

interface UserState {
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
    setIsLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
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

export const {
  setIsLoading,
} = userSlice.actions;

export default userSlice.reducer;


