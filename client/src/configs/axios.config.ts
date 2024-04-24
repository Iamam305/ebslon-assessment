import axios, { AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

export const useAxios = async (config: AxiosRequestConfig) => {
  try {
    const response = await instance({...config, withCredentials: true});
    return [response.data, null];
  } catch (error) {
    return [null, error];
  }
};

