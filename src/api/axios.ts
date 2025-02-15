import { BACKEND_API_URL } from "@dine-desk/constants/credentials";
import axios, { AxiosRequestConfig } from "axios";

export const baseURL = BACKEND_API_URL;

axios.defaults.baseURL = baseURL;

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
