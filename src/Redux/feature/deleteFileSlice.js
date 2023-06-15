import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { deleteFileAction } from '@/lib/url';

const initialState = {
  id: '',
  status: '',
  error: '',
  modal: false,
  deleteUserSuccess: false,
};

export const deleteFiles = createAsyncThunk('files/deleteFiles', async (id) => {
  const response = await deleteFileAction(id);
  return response.data.data;
});
export const deleteFileSlice = createSlice({
  name: 'deleteFile',
  initialState,
  reducers: {
    openModal: (state) => {
      state.modal = true;
      state.deleteUserSuccess = false;
    },
    closeModal: (state) => {
      state.modal = false;
      state.deleteUserSuccess = false;
    },
    getDeleteId: (state, action) => {
      state.id = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(deleteFiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteFiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.id = action.payload;
        state.deleteUserSuccess = true;
      })
      .addCase(deleteFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal, getDeleteId } = deleteFileSlice.actions;

export default deleteFileSlice.reducer;
