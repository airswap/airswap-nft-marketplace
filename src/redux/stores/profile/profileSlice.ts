import { FullOrder } from '@airswap/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getProfileOrders, getProfileTokens } from './profileApi';

export interface ProfileState {
  isLoadingOrders: boolean;
  isLoadingTokens: boolean;
  isTotalOrdersReached: boolean;
  orders: FullOrder[];
  tokens: number[];
  tokensOffset: number;
}

export const tokensOffsetInterval = 8;

const initialState: ProfileState = {
  isLoadingOrders: false,
  isLoadingTokens: false,
  isTotalOrdersReached: false,
  orders: [],
  tokens: [],
  tokensOffset: tokensOffsetInterval,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: (): ProfileState => ({
      ...initialState,
    }),
    setTokensOffset: (state, action: PayloadAction<number>): ProfileState => ({
      ...state,
      tokensOffset: action.payload,
    }),
  },
  extraReducers: builder => {
    builder.addCase(getProfileOrders.pending, (state): ProfileState => ({
      ...state,
      isLoadingOrders: true,
    }));

    builder.addCase(getProfileOrders.fulfilled, (state, action): ProfileState => {
      const newOrders = [
        ...state.orders,
        ...action.payload,
      ];

      return {
        ...state,
        isLoadingOrders: false,
        orders: newOrders,
      };
    });

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

export const {
  reset,
  setTokensOffset,
} = profileSlice.actions;

export default profileSlice.reducer;
