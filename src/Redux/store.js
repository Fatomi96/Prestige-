import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth/authSlice';
import deleteFileReducer from './feature/deleteFileSlice';
import fileReducer from './feature/getFileSlice';
import searchReducer from './feature/searchSlice';
import newCustomerReducer from './feature/addCustomerSlice';
import editCustomerReducer from './feature/editCustomerSlice';
import singleCustomerReducer from './feature/singleCustomerSlice';
import addAdminReducer from './feature/addAdminSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    newCustomer: newCustomerReducer,
    search: searchReducer,
    deleteUser: deleteFileReducer,
    editCustomer: editCustomerReducer,
    single: singleCustomerReducer,
    addAdmin: addAdminReducer
  },
  devTools: true,
});
