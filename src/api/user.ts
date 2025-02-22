import { loginData, registerData } from "@dine-desk/schema/login";
import { useMutation } from ".";
import { axiosPost } from "./axios";

export const useCreateUser = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: registerData) => {
      const res = await axiosPost("/user/register", {
        data: data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return res;
    },
  });
};
export const useLoginUser = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: loginData) => {
      const res = await axiosPost("/user/login", {
        data: data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return res.data?.data;
    },
  });
};
