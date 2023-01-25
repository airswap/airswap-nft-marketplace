import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAvatarByAddress = createAsyncThunk<
string, { address: string }>(
  'user/fetchAvatarByAddress',
  async ({ address }) => {
    const response = await fetch(
      `https://api.dicebear.com/5.x/identicon/svg?seed=${address}`,
    );
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },
);
