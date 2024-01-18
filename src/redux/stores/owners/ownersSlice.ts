import { createSlice } from '@reduxjs/toolkit';

import { Address } from '../../../entities/Address/Address';
import { getErc1155OwnerAddresses } from './ownersApi';

export interface NftDetailState {
  isLoading: boolean;
  owners: Address[];
  pageKey?: string | null;
}

const initialState: NftDetailState = {
  isLoading: false,
  owners: [],
};

export const ownersSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {
    reset: (): NftDetailState => ({
      ...initialState,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(getErc1155OwnerAddresses.pending, (state): NftDetailState => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(getErc1155OwnerAddresses.fulfilled, (state, action): NftDetailState => ({
      ...state,
      isLoading: false,
      owners: action.payload.owners,
      pageKey: action.payload.pageKey,
    }));
    builder.addCase(getErc1155OwnerAddresses.rejected, (state): NftDetailState => ({
      ...state,
      isLoading: false,
    }));
  },
});

export const {
  reset,
} = ownersSlice.actions;

export default ownersSlice.reducer;
