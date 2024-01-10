import { createSlice } from '@reduxjs/toolkit';

import { Address } from '../../../entities/Address/Address';
import { getErc1155OwnerAddresses } from './ownersApi';

export interface NftDetailState {
  isLoadingOwners: boolean;
  owners: Address[];
  ownersPageKey?: string | null;
}

const initialState: NftDetailState = {
  isLoadingOwners: false,
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
      isLoadingOwners: true,
    }));
    builder.addCase(getErc1155OwnerAddresses.fulfilled, (state, action): NftDetailState => ({
      ...state,
      isLoadingOwners: false,
      owners: action.payload.owners,
      ownersPageKey: action.payload.pageKey,
    }));
    builder.addCase(getErc1155OwnerAddresses.rejected, (state): NftDetailState => ({
      ...state,
      isLoadingOwners: false,
    }));
  },
});

export const {
  reset,
} = ownersSlice.actions;

export default ownersSlice.reducer;
