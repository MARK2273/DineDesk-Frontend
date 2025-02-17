import { useInvalidateQuery } from "./data-fetching";
import { axiosGet, axiosPost, axiosPut } from "./axios";
import { useMutation, useQuery } from ".";
import { itemQueryKeyMap } from "./common/itemQueryKey";

type AddUpdateItem =
  | {
      menuId?: string;
      id?: string;
      name: string;
      price: string;
      category: string;
      description: string;
      available?: boolean;
    }[]
  | undefined;

export const useCreateItem = () => {
  const { invalidate } = useInvalidateQuery();
  return useMutation({
    mutationKey: ["addItem"],
    mutationFn: async (data: AddUpdateItem) => {
      const res = await axiosPost("/item", {
        data: data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return res;
    },
    onSuccess: async () => {
      await invalidate(itemQueryKeyMap.itemList());
    },
  });
};

export const useUpdateItems = () => {
  const { invalidate } = useInvalidateQuery();
  return useMutation({
    mutationKey: ["updateItems"],
    mutationFn: async (data: AddUpdateItem) => {
      const res = await axiosPut(`/item`, {
        data: data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      return res;
    },
    onSuccess: async () => {
      await invalidate(itemQueryKeyMap.itemList());
    },
  });
};

export const useGetItemList = (menuId?: string, params?: object) => {
  return useQuery({
    queryKey: itemQueryKeyMap.itemList(menuId, params),
    queryFn: () =>
      axiosGet(`/item/${menuId}`, {
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
    enabled: !!menuId,
    experimental_prefetchInRender: true,
  });
};
