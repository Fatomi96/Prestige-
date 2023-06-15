import { APIKit } from './apiFunc';
// let user;
// if (typeof window !== 'undefined') {
//   user = JSON.parse(sessionStorage.getItem('user'));
// }

// export const getCustomerFileAction = (payload) => {
//   console.log(payload);
//   return APIKit.get(`/documents/user/files?page=${payload}`);
// };
export const getCustomerFileAction = (payload) => {
  return APIKit.get(`/customers?page=${payload ?? 1}`);
};
export const addCustomerAction = async (payload) => {
  console.log(payload);
  return await APIKit.post(`/customers`, payload);
};
export const addAdminAction = async (payload) => {
  return await APIKit.post(`/auth/users`, payload);
}
export const deleteFileAction = (id, payload) => {
  return APIKit.delete(`/customers/${id}`, payload);
};
export const editCustomerAction = (id, payload) => {
  console.log(id, payload);
  return APIKit.put(`/customers/${id}`, payload);
};
export const getSingleCustomerAction = (id) => {
  return APIKit.get(`/customers/${id}`);
};
export const getSearchAction = (payload) => {
  console.log(payload);
  return APIKit.get(`customers/search/${payload.value}`);
};
export const verifyCustomerQRAction = (payload) => {
  return APIKit.get(`/customers/verify${payload.pathname}`);
};
