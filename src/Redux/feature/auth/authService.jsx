/* eslint-disable no-unused-vars */
import { APIKit, Header } from "@/lib/apiFunc";
const login = async (payload) => {
  const config = {
    headers: Header,
  };

  const response = await APIKit.post("/auth/login", payload, config);
  if (response.data) {
    sessionStorage.setItem("user", JSON.stringify(response.data));
    // localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// Logout user
const logout = () => {
  sessionStorage.removeItem("user");
  // localStorage.removeItem("token");
};

const authService = {
  logout,
  login,
};

export default authService;

