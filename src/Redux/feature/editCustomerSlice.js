import { editCustomerAction } from '@/lib/url';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  editCustomerLoading: false,
  editCustomerData: '',
  editCustomerIsSucesss: false,
  editCustomerMessage: '',
  editCustomerIsError: false,
};

export const editCustomer = createAsyncThunk(
  'editCustomer',
  async ({ payload }, thunkAPI) => {
    console.log({ payload });
    try {
      const id = payload.cusId;
      const response = await editCustomerAction(id, payload);
      return response.data.data;
    } catch (error) {
      const message = error.data.data.error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const editCustomerSlice = createSlice({
  name: 'editCustomer',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.editCustomerLoading = false;
      state.editCustomerIsSucesss = false;
      state.editCustomerIsError = false;
    },
    getEditId: (state, action) => {
      state.id = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(editCustomer.pending, (state) => {
        state.editCustomerLoading = true;
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        state.editCustomerLoading = false;
        state.editCustomerData = action.data;
        state.editCustomerIsSucesss = true;
      })
      .addCase(editCustomer.rejected, (state, action) => {
        state.editCustomerLoading = false;
        state.editCustomerIsError = true;
        state.editCustomerMessage = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { toggleModal, getEditId } = editCustomerSlice.actions;

export default editCustomerSlice.reducer;
