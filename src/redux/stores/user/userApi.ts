import { createAsyncThunk } from '@reduxjs/toolkit';

const convertBase64ToBlob = async (base64: string) => {
  const response = await fetch(base64);
  return response.blob();
};

const convertBlobToBase64 = (blob: any) => new Promise<any>((resolve, reject) => {
  const reader = new FileReader();
  reader.onerror = reject;
  reader.onload = () => {
    resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});

export const fetchAvatarByAddress = createAsyncThunk<
string, { address: string }>(
  'user/fetchAvatarByAddress',
  async ({ address }) => {
    const avatarUrl = localStorage.getItem(`airswap/avatarUrl/${address}`);
    if (avatarUrl) {
      const blob = await convertBase64ToBlob(avatarUrl);
      return URL.createObjectURL(blob);
    }

    const response = await fetch(
      `https://api.dicebear.com/5.x/identicon/svg?seed=${address}`,
    );
    const blob = await response.blob();

    const base64 = await convertBlobToBase64(blob);
    localStorage.setItem(`airswap/avatarUrl/${address}`, base64);

    return URL.createObjectURL(blob);
  },
);

