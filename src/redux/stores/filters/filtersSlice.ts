import { CollectionTokenAttribute } from '@airswap/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getTagOptions } from './filtersApi';

export interface FiltersState {
  isLoadingTags: boolean;
  activeTags: string[];
  tagOptions: CollectionTokenAttribute[];
  search: string;
}

const initialState: FiltersState = {
  isLoadingTags: false,
  activeTags: [],
  tagOptions: [],
  search: '',
};

export const FiltersSlice = createSlice({
  name: 'filtersReducer',
  initialState,
  reducers: {
    resetSelectedFilters(state): FiltersState {
      return {
        ...state,
        activeTags: [],
        search: '',
      };
    },
    setActiveTags(state, action: PayloadAction<string[]>): FiltersState {
      return {
        ...state,
        activeTags: action.payload,
      };
    },
    setSearch(state, action: PayloadAction<string>): FiltersState {
      return {
        ...state,
        search: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTagOptions.pending, (state): FiltersState => ({
      ...state,
      isLoadingTags: true,
    }));

    builder.addCase(getTagOptions.rejected, (state): FiltersState => ({
      ...state,
      isLoadingTags: false,
    }));

    builder.addCase(getTagOptions.fulfilled, (state, action): FiltersState => ({
      ...state,
      isLoadingTags: false,
      tagOptions: action.payload,
    }));
  },
});

export const {
  resetSelectedFilters,
  setActiveTags,
  setSearch,
} = FiltersSlice.actions;

export default FiltersSlice.reducer;
