import { BACKEND_API_URL } from "@dine-desk/constants/credentials";
import { storageHelper } from "@dine-desk/helper/storageHelper";
import axios, { AxiosRequestConfig } from "axios";

export const baseURL = BACKEND_API_URL;

axios.defaults.baseURL = baseURL;

axios.interceptors.request.use(
  (config) => {
    const storage = storageHelper("session");
    const token = storage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const storage = storageHelper("session");
      storage.removeItem("token"); // Remove invalid token
      window.location.href = "/login"; // Redirect user to login page
    }
    return Promise.reject(error);
  }
);

export const axiosGet = async (
  url: string,
  config?: AxiosRequestConfig<object>
) => axios.get(url, { ...config });

export const axiosPost = async (
  url: string,
  { data, ...config }: { data?: object } & AxiosRequestConfig<object>
) => axios.post(url, data, config);

export const axiosPatch = async (
  url: string,
  { data, ...config }: { data?: object } & AxiosRequestConfig<object>
) => axios.patch(url, data, config);

export const axiosPut = async (
  url: string,
  { data, ...config }: { data?: object } & AxiosRequestConfig<object>
) => axios.put(url, data, config);

export const axiosDelete = async (
  url: string,
  config?: AxiosRequestConfig<object>
) => axios.delete(url, config);
