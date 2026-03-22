import { api } from "./axios";

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const register = async (
  firstName: string,
  lastName: string,
  gender: string,
  birthdate: Date,
  email: string,
  password: string
) => {
  const { data } = await api.post("/auth/register", {
    firstName,
    lastName,
    gender,
    birthdate,
    email,
    password,
  });
  return data;
};