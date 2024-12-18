import { axiosInstance } from "../axios";

export const signup = async (data) => {
  const response = await axiosInstance.post("/user/signup", data);
  return response.data;
};

export const login = async (data) => {
  const response = await axiosInstance.post("/user/login", data);
  return response.data;
};
