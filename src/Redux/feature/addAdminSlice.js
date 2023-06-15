import { addAdminAction } from '@/lib/url';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    addAdminLoading: false,
    addAdminData: '',
    addAdminIsSucesss: false,
    addAdminMessage: '',
    addAdminIsError: false,
};

export const addAdmin = createAsyncThunk(
    'addAdmin',
    async (payload, thunkAPI) => {
        try {
            const response = await addAdminAction(payload);
            console.log(response)
            return response.data.data;
        } catch (error) {
            const message = error.data.data.error;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addAdminSlice = createSlice({
    name: 'addAdmin',
    initialState,
    reducers: {
        toggleModal: (state) => {
            state.addAdminLoading = false;
            state.addAdminIsSucesss = false;
            state.addAdminIsError = false;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(addAdmin.pending, (state) => {
                state.addAdminLoading = true;
            })
            .addCase(addAdmin.fulfilled, (state, action) => {
                state.addAdminLoading = false;
                state.addAdminData = action.data;
                state.addAdminIsSucesss = true;
            })
            .addCase(addAdmin.rejected, (state, action) => {
                state.addAdminLoading = false;
                state.addAdminIsError = true;
                state.addAdminMessage = action.payload;
            });
    },
});

// Action creators are generated for each case reducer function
export const { toggleModal } = addAdminSlice.actions;

export default addAdminSlice.reducer;
