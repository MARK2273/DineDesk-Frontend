import { MenuData } from "@dine-desk/schema/menu";
import { useMutation, useQuery } from ".";
import { axiosGet, axiosPost, axiosPut } from "./axios";
import { menuQueryKeyMap } from "./common/menuQueryKey";
import { useInvalidateQuery } from "./data-fetching";

export const useCreateMenu = () => {
  const { invalidate } = useInvalidateQuery();
  return useMutation({
    mutationKey: ["addMenu"],
    mutationFn: async (data: MenuData) => {
      const res = await axiosPost("/menu", {
        data: data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return res;
    },
    onSuccess: async () => {
      await invalidate(menuQueryKeyMap.menuList());
    },
  });
};

export const useGetMenuList = (params?: object) => {
  return useQuery({
    queryKey: menuQueryKeyMap.menuList(params),
    queryFn: () =>
      axiosGet("/menu", {
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

export const useUpdateMenu = (id: string | number | undefined) => {
  const { invalidate } = useInvalidateQuery();
  return useMutation({
    mutationKey: ["updateMenu", id],
    mutationFn: async (data: MenuData) => {
      const res = await axiosPut(`/menu/${id}`, {
        data: data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return res;
    },
    onSuccess: async () => {
      await invalidate(menuQueryKeyMap.menu(id));
      await invalidate(menuQueryKeyMap.menuList());
    },
  });
};

export const useGetMenu = (id: string | number | undefined) => {
  return useQuery({
    queryKey: menuQueryKeyMap.menu(id),
    queryFn: () => axiosGet(`/menu/${id}`),
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
