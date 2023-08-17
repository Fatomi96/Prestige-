import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {getRecentGuestsByDateAction} from '@/lib/url'


const initialState = {
  guestDateRequest: '',
  guestDateResult: [],
  status: '',
  error: '',
  checks: [],
};

export const guestsByDate = createAsyncThunk(
  'guests/filterByTypeFiles',
  async ({dateRange, pageNum}, thunkAPI) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    try  { 
      const response = await fetch(`../api/guests/recent-guest?page=${pageNum}&per_page=20&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`, requestOptions);
      const text = await response.text()
      return JSON.parse(text)

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

export const guestsByDateSlice = createSlice({
  name: 'guestsByDate',
  initialState,
  reducers: {
    emptyFilesDateType: (state) => {
      state.guestDateResult = [];
      state.guestDateRequest = '';
    },
    addDateFileData: (state, { payload }) => {
      state.guestDateRequest = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(guestsByDate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(guestsByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.guestDateResult = action.payload.data;
      })
      .addCase(guestsByDate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const { emptyFilesDateType, addDateFileData } = guestsByDateSlice.actions;

export default guestsByDateSlice.reducer;