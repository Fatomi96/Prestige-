import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getSingleCustomerAction } from '@/lib/url';

const initialState = {
  singleCustomer: '',
  status: '',
  error: '',
  checks: [],
  total: 0,
  page: 1,
};

export const fetchSingleCustomer = createAsyncThunk(
  'singleCustomer',
  async (id, thunkAPI) => {
    try {
      const response = await getSingleCustomerAction(id);
      return response.data.data.customer;
    } catch (error) {
      const message = error.response.data.data;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const singleCustomerSlice = createSlice({
  name: 'singleCustomer',
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
      .addCase(fetchSingleCustomer.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSingleCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.singleCustomer = action.payload;
      })
      .addCase(fetchSingleCustomer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { checked, defPage, addTotal, nextPage, prevPage } =
  singleCustomerSlice.actions;

export default singleCustomerSlice.reducer;
