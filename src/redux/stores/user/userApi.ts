import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAvatarByAddress = createAsyncThunk(
  'users/fetchAvatarByAddress',
  async (address: string) => {
    const response = await fetch(
      `https://api.dicebear.com/5.x/identicon/svg?seed=${address}`,
    );
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
);
