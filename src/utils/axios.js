import axios from "axios";
import { getToken } from "./token";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/",
});

axiosInstance.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});
