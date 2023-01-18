import { Web3Provider } from '@ethersproject/providers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LibraryState {
  library: { [key: string]: Web3Provider };
}

const initialState: LibraryState = {
  library: {},
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    setLibrary: (state, action: PayloadAction<any>) => {
      const provider = action.payload;
      const chainId = parseInt(provider.chainId, 16);
      if (!state.library[chainId]) {
        state.library[chainId] = new Web3Provider(provider);
        state.library[chainId].pollingInterval = 12000;
      }
    },
  },
});

export const { setLibrary } = librarySlice.actions;

export default librarySlice.reducer;
