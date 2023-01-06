import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MetadataState {
  isLoading: boolean;
}

const initialState: MetadataState = {
  isLoading: false,
};

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isLoading: action.payload,
    }),
  },
});

export const {
  setIsLoading,
} = metadataSlice.actions;

export default metadataSlice.reducer;
