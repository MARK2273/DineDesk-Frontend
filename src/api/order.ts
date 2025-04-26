import { OrderFormData } from "@dine-desk/schema/order";
import { useMutation } from ".";
import { axiosPost } from "./axios";
import { orderQueryKeyMap } from "./common/orderQueryKey";
import { useInvalidateQuery } from "./data-fetching";

export const useCreateOrder = () => {
  const { invalidate } = useInvalidateQuery();
  return useMutation({
    mutationKey: ["addMenu"],
    mutationFn: async (data: OrderFormData) => {
      const res = await axiosPost("/order", {
        data: data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return res;
    },
    onSuccess: async () => {
      await invalidate(orderQueryKeyMap.orderList());
    },
  });
};
