import { axiosInstance } from "../utils/axios";

export const login = async (values) => {
  const response = await axiosInstance.post("/login", values);
  return response.data;
};
