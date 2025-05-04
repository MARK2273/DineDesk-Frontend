import { useQuery } from ".";
import { axiosGet } from "./axios";

// export const useGetDashboard = (params?: object) => {
//   return useQuery({
//     queryKey: ["dashboard", params],
//     queryFn: () =>
//       axiosGet("/dahboard", {
//         params: {
//           ...params,
//         },
//       }),
//     select: (res) => {
//       if (res.data?.data?.data.length) {
//         return res.data?.data;
//       }
//       return [];
//     },
//     experimental_prefetchInRender: true,
//   });
// };

export const useGetDashboard = (id: string | number, params?: object) => {
  return useQuery({
    queryKey: ["dashboard", id, params],
    queryFn: () => axiosGet(`/dashboard/${id}`, { params }),
    select: (res) => {
      if (res.data?.success) {
        return res.data?.data;
      }
      return [];
    },
    enabled: !!id,
    experimental_prefetchInRender: true,
  });
};
