import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Toast } from '../../../entities/Toast/Toast';

interface ToastsState {
  toasts: Toast[];
}

const initialState: ToastsState = {
  toasts: [],
};

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    setToasts: (state, action: PayloadAction<Toast[]>) => ({
      ...state,
      toasts: action.payload,
    }),
  },
});

export const { setToasts } = toastsSlice.actions;

export default toastsSlice.reducer;
