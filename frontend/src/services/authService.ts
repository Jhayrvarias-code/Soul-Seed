import { api } from "../api/axios";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  gender: string;
  birthdate: Date;
  email: string;
  password: string;
  confirmPassword: string;
}

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// export const logout = async () => {
//   const res = await api.post("/auth/logout");
//   return res.data;
// };
