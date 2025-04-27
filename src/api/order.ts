import { OrderFormData } from "@dine-desk/schema/order";
import { useMutation, useQuery } from ".";
import { axiosGet, axiosPost } from "./axios";
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

export const useGetOrderList = (params?: object) => {
  return useQuery({
    queryKey: orderQueryKeyMap.orderList(params),
    queryFn: () =>
      axiosGet("/order", {
        params: {
          ...params,
        },
      }),
    select: (res) => {
      if (res.data?.data?.data.length) {
        return res.data?.data;
      }
      return [];
    },
    experimental_prefetchInRender: true,
  });
};

export const useGetOrderDetails = (id: string | number) => {
  return useQuery({
    queryKey: orderQueryKeyMap.order(id),
    queryFn: () => axiosGet(`/order/${id}`),
    select: (res) => {
      if (res.data?.data?.items.length) {
        return res.data?.data;
      }
      return [];
    },
    experimental_prefetchInRender: true,
  });
};
