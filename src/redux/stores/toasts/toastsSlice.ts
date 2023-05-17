import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Toast } from '../../../entities/Toast/Toast';

interface ToastsState {
  toasts: Toast[];
  lastToastActionButtonIdClicked?: string;
}

const initialState: ToastsState = {
  toasts: [],
};

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    setLastToastActionButtonIdClicked: (state, action: PayloadAction<string | undefined>): ToastsState => ({
      ...state,
      lastToastActionButtonIdClicked: action.payload,
    }),
    setToasts: (state, action: PayloadAction<Toast[]>): ToastsState => ({
      ...state,
      toasts: action.payload,
    }),
  },
});

export const { setLastToastActionButtonIdClicked, setToasts } = toastsSlice.actions;

export default toastsSlice.reducer;
