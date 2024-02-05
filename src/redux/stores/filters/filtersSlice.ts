import { CollectionTokenAttribute } from '@airswap/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getTagOptions } from './filtersApi';

export interface FiltersState {
  isLoadingTags: boolean;
  activeTags: string[];
  tagOptions: CollectionTokenAttribute[];
  search: string;
  selectedTags: string[];
}

const initialState: FiltersState = {
  isLoadingTags: false,
  activeTags: [],
  tagOptions: [],
  search: '',
  selectedTags: [],
};

export const FiltersSlice = createSlice({
  name: 'filtersReducer',
  initialState,
  reducers: {
    setActiveTags(state, action: PayloadAction<string[]>): FiltersState {
      return {
        ...state,
        activeTags: action.payload,
      };
    },
    setSelectedTags(state, action: PayloadAction<string[]>): FiltersState {
      return {
        ...state,
        selectedTags: action.payload,
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
  setActiveTags,
  setSelectedTags,
  setSearch,
} = FiltersSlice.actions;

export default FiltersSlice.reducer;
