import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TagResponse, CreateTagDto, UpdateTagDto } from '@/features/tags/types/tag.dto';

interface TagsState {
  items: TagResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  items: [],
  loading: false,
  error: null,
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    // Fetch
    fetchTagsRequest: (state) => { state.loading = true; },
    fetchTagsSuccess: (state, action: PayloadAction<TagResponse[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchTagsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add
    addTagRequest: (state, _action: PayloadAction<CreateTagDto>) => {
      state.loading = true;
    },
    addTagSuccess: (state, action: PayloadAction<TagResponse>) => {
      state.loading = false;
      state.items.push(action.payload);
    },
    // Update
    updateTagRequest: (state, _action: PayloadAction<{ id: string; data: UpdateTagDto }>) => {
      state.loading = true;
    },
    updateTagSuccess: (state, action: PayloadAction<TagResponse>) => {
      state.loading = false;
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    // Delete
    deleteTagRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
    },
    deleteTagSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    tagsOperationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearTags: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  }
});

export const {
  fetchTagsRequest, fetchTagsSuccess, fetchTagsFailure,
  addTagRequest, addTagSuccess,
  updateTagRequest, updateTagSuccess,
  deleteTagRequest, deleteTagSuccess,
  tagsOperationFailure,clearTags
} = tagsSlice.actions;

export default tagsSlice.reducer;