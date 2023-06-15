import { addCustomerAction } from '@/lib/url';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  addCustomerLoading: false,
  addCustomerData: '',
  addCustomerIsSucesss: false,
  addCustomerMessage: '',
  addCustomerIsError: false,
};

export const addCustomer = createAsyncThunk(
  'addCustomer',
  async (payload, thunkAPI) => {
    try {
      const response = await addCustomerAction(payload);
      console.log(response)
      return response.data.data;
    } catch (error) {
      const message = error.data.data.error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addCustomerSlice = createSlice({
  name: 'addCustomer',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.addCustomerLoading = false;
      state.addCustomerIsSucesss = false;
      state.addCustomerIsError = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addCustomer.pending, (state) => {
        state.addCustomerLoading = true;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.addCustomerLoading = false;
        state.addCustomerData = action.data;
        state.addCustomerIsSucesss = true;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.addCustomerLoading = false;
        state.addCustomerIsError = true;
        state.addCustomerMessage = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { toggleModal } = addCustomerSlice.actions;

export default addCustomerSlice.reducer;
