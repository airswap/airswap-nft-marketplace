import { FullOrder } from '@airswap/types';
import { createSlice } from '@reduxjs/toolkit';

import { getProfileOrders, getProfileTokens } from './profileApi';

export interface ProfileState {
  isLoadingOrders: boolean;
  isLoadingTokens: boolean;
  orders: FullOrder[];
  tokens: number[];
}

const initialState: ProfileState = {
  isLoadingOrders: false,
  isLoadingTokens: false,
  orders: [],
  tokens: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProfileOrders.pending, (state): ProfileState => ({
      ...state,
      isLoadingOrders: true,
    }));

    builder.addCase(getProfileOrders.fulfilled, (state, action): ProfileState => ({
      ...state,
      isLoadingOrders: false,
      orders: action.payload,
    }));

    builder.addCase(getProfileOrders.rejected, (state, action): ProfileState => {
      console.error('profile/getProfileOrders', action);

      return {
        ...state,
        isLoadingOrders: false,
      };
    });

    builder.addCase(getProfileTokens.pending, (state): ProfileState => ({
      ...state,
      isLoadingTokens: true,
    }));

    builder.addCase(getProfileTokens.fulfilled, (state, action): ProfileState => ({
      ...state,
      isLoadingTokens: false,
      tokens: action.payload,
    }));

    builder.addCase(getProfileTokens.rejected, (state, action): ProfileState => {
      console.error('profile/getProfileTokens', action);

      return {
        ...state,
        isLoadingTokens: false,
      };
    });
  },
});

export default profileSlice.reducer;
