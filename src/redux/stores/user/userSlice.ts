import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchAvatarByAddress } from './userApi';

export interface UserState {
  isLoading: boolean;
  address?: string;
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
    setAddress: (state, action: PayloadAction<string>) => ({
      ...state,
      address: action.payload,
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
  setIsLoading, setAddress,
} = userSlice.actions;

export default userSlice.reducer;


