/* eslint-disable no-unused-vars */
import { APIKit, Header } from "@/lib/apiFunc";

const login = async (payload, setCurrentForm) => {
  const config = {
    headers: Header,
  };

  const response = await APIKit.post("/auth/login", payload, config);
  return response.data;
};
  
// Logout user
const logout = () => {
  sessionStorage.removeItem("user");
};

const authService = {
  logout,
  login,
};

export default authService;

