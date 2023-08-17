import { APIKit } from './apiFunc';

export const getCustomerFileAction = (payload) => {
  return APIKit.get(`/customers?page=${payload ?? 1}`);
};
export const addCustomerAction = async (payload) => {
  return await APIKit.post(`/customers`, payload);
};
export const addAdminAction = async (payload) => {
  return await APIKit.post(`/auth/users`, payload);
}

export const getRecentGuestsByDateAction = async (date) => {
  return APIKit.post(`/customers?fromDate=${date.startDate}&toDate=${date.endDate}`)
}

export const deleteFileAction = (id, payload) => {
  return APIKit.delete(`/customers/${id}`, payload);
};
export const editCustomerAction = (id, payload) => {
  return APIKit.put(`/customers/${id}`, payload);
};
export const getSingleCustomerAction = (id) => {
  return APIKit.get(`/customers/${id}`);
};
export const getSearchAction = (payload) => {
  return APIKit.get(`customers/search/${payload.value}`);
};
export const verifyCustomerQRAction = (payload) => {
  return APIKit.get(`/customers/verify${payload.pathname}`);
};

export const getDeletedCustomers = (payload) => {
  return APIKit.get(`/customers/deleted-customers`);
};