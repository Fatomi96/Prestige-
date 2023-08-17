import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getCustomerFileAction } from '@/lib/url';

const initialState = {
  customerFiles: [],
  status: '',
  error: '',
  checks: [],
  total: 0,
  page: 1
};

export const fetchCustomerFiles = createAsyncThunk(
  'files/customerFiles',
  async (payload, thunkAPI) => {
    try {
      const response = await getCustomerFileAction(payload);
      return response.data.data;
    } catch (error) {
      const message = error.response.data.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFileSlice = createSlice({
  name: 'getFile',
  initialState,
  reducers: {
    checked: (state, { payload }) => {
      state.checks = payload;
    },
    addTotal: (state, { payload }) => {
      state.total = payload;
    },
    nextPage: (state) => {
      state.page += 1;
    },
    prevPage: (state) => {
      state.page -= 1;
    },
    defPage: (state) => {
      state.page = 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCustomerFiles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCustomerFiles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.customerFiles = action.payload;
      })
      .addCase(fetchCustomerFiles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { checked, defPage, addTotal, nextPage, prevPage } =
  getFileSlice.actions;

export default getFileSlice.reducer;
