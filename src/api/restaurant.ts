import { useMutation, useQuery } from ".";
import { axiosDelete, axiosGet, axiosPost, axiosPut } from "./axios";
import { useInvalidateQuery } from "./data-fetching";
import { restaurantQueryKeyMap } from "./common/restaurantQueryKey";

export const useCreateRestaurant = () => {
  const { invalidate } = useInvalidateQuery();
  return useMutation({
    mutationKey: ["addRestaurant"],
    mutationFn: async (data: FormData) => {
      const res = await axiosPost("/restaurant", {
        data,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return res;
    },
    onSuccess: async () => {
      await invalidate(restaurantQueryKeyMap.restaurantList());
    },
  });
};

export const useGetRestaurantList = (params?: object) => {
  return useQuery({
    queryKey: restaurantQueryKeyMap.restaurantList(params),
    queryFn: () =>
      axiosGet("/restaurant", {
        params: {
          ...params,
        },
      }),
    select: (res) => {
      if (res.data?.data?.length) {
        return res.data?.data;
      }
      return [];
    },
    experimental_prefetchInRender: true,
  });
};

export const useUpdateRestaurant = (id: string | number | undefined) => {
  const { invalidate } = useInvalidateQuery();
  return useMutation({
    mutationKey: ["updateRestaurant", id],
    mutationFn: async (data: FormData) => {
      const res = await axiosPut(`/restaurant/${id}`, {
        data,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return res;
    },
    onSuccess: async () => {
      await invalidate(restaurantQueryKeyMap.restaurant(id));
      await invalidate(restaurantQueryKeyMap.restaurantList());
    },
  });
};

export const useGetRestaurant = (id: string | number | undefined) => {
  return useQuery({
    queryKey: restaurantQueryKeyMap.restaurant(id),
    queryFn: () => axiosGet(`/restaurant/${id}`),
    select: (res) => {
      if (res.data?.data) {
        return res.data?.data;
      }
      return null;
    },
    experimental_prefetchInRender: true,
    enabled: !!id,
  });
};

export const useArchiveRestaurant = () => {
  const { invalidate } = useInvalidateQuery();
  return useMutation({
    mutationKey: ["archiveRestaurant"],
    mutationFn: async (id: number) => {
      const res = await axiosDelete(`/restaurant/${id}`);
      return res;
    },
    onSuccess: async () => {
      await invalidate(restaurantQueryKeyMap.restaurantList());
    },
  });
};
