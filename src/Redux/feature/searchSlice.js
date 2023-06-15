import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getSearchAction } from '@/lib/url';

const initialState = {
  searchRequest: '',
  searchResult: [],
  status: '',
  error: '',
  checks: [],
};
export const searchFiles = createAsyncThunk(
  'files/searchFiles',
  async (payload, thunkAPI) => {
    console.log(payload);
    try {
      const response = await getSearchAction(payload);
      console.log(response?.data?.data);
      return response?.data?.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.response ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const searchSlice = createSlice({
  name: 'searchFile',
  initialState,
  reducers: {
    emptySearch: (state) => {
      state.searchResult = [];
      state.searchRequest = '';
    },
    addSearchData: (state, { payload }) => {
      state.searchRequest = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(searchFiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchFiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchResult = action.payload;
      })
      .addCase(searchFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { emptySearch, addSearchData } = searchSlice.actions;

export default searchSlice.reducer;
