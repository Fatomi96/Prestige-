import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

let user;
// const sessionToken = JSON.parse(sessionStorage.getItem("user"))

if (typeof window !== "undefined") {

  user = JSON.parse(sessionStorage.getItem("user"))

  // if(sessionToken){

  // user = JSON.parse(sessionStorage.getItem("user"))


  // }else{

  //   user = JSON.parse(localStorage.getItem("token"));

  // }
}

// Get user from sessionStorage

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload, thunkAPI) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//Logout
export const logout = createAsyncThunk("auth/logout", () => {
  authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.user = user ? user : null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.message = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "";
        window.location = "/";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        window.location = "/login";
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;

// import authService from "./authService";

// let user;

// if (typeof window !== "undefined") {
//   user = JSON.parse(sessionStorage.getItem("user"));
// }

// // Get user from sessionStorage

// const initialState = {
//   user: user ? user : null,
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: "",
// };

// export const login = createAsyncThunk(
//   "auth/login",
//   async (payload, thunkAPI) => {
//     try {
//       console.log(payload);
//       return await authService.login(payload);
//     } catch (error) {
//       const message = error.response.data.message;
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );
// //Logout
// export const logout = createAsyncThunk("auth/logout", () => {
//   authService.logout();
// });

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     reset: (state) => {
//       state.user = user ? user : null;
//       state.isError = false;
//       state.isSuccess = false;
//       state.isLoading = false;
//       state.message = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//         state.message = "";
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSuccess = true;
//         state.user = action.payload;
//         state.message = "";
//         window.location = "/";
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//       })
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         window.location = "/login";
//       });
//   },
// });

// export const { reset } = authSlice.actions;
// export default authSlice.reducer;

