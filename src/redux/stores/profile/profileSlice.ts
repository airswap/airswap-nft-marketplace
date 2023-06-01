import { FullOrder } from '@airswap/types';
import { createSlice } from '@reduxjs/toolkit';

import { getProfileOrders } from './profileApi';

export interface ProfileState {
  isLoading: boolean;
  orders: FullOrder[];
}

const initialState: ProfileState = {
  isLoading: false,
  orders: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getProfileOrders.pending, (state): ProfileState => ({
      ...state,
      isLoading: true,
    }));

    builder.addCase(getProfileOrders.fulfilled, (state, action): ProfileState => ({
      ...state,
      isLoading: false,
      orders: action.payload,
    }));

    builder.addCase(getProfileOrders.rejected, (state, action): ProfileState => {
      console.error('fetchNftMeta.rejected', action);

      return state;
    });
  },
});

export default profileSlice.reducer;
