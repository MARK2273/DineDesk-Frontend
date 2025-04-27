import { useGetOrderList } from "@dine-desk/api/order";
import { useTableManagement } from "@dine-desk/Common/Components/Table";
import { formatDate } from "@dine-desk/helper";
import { RootState } from "@dine-desk/redux/store";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useOrderManagement = () => {
  const selectedRestaurant = useSelector(
    (state: RootState) => state.restaurant?.selectedRestaurant
  );

  const restaurantId = selectedRestaurant?.id;
  const { apiData, setCurrentPage, currentPage } = useTableManagement<
    any,
    object
  >({
    apiCall: useGetOrderList,
    initialQueryParams: {
      restaurantId: restaurantId || "",
    },
  });
  const { data, isLoading: isDataLoading, dataUpdatedAt } = apiData;

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        id: "orderId",
        accessorKey: "orderId",
        header: "Order ID",
        cell: ({ row }: { row: any }) => {
          return row?.original?.id;
        },
      },

      {
        id: "orderStatus",
        accessorKey: "orderStatus",
        header: "Order Status",
        cell: ({ row }: { row: any }) => {
          return row?.original?.status;
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({ row }: { row: any }) => {
          return row?.original?.totalAmount;
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Order Date",
        cell: ({ row }: { row: any }) => {
          return formatDate(row?.original?.createdAt);
        },
      },
    ],
    [dataUpdatedAt]
  );
  return {
    data: data?.data,
    isDataLoading,
    columns,
    setCurrentPage,
    currentPage: data?.currentPage || currentPage,
    totalRows: data?.total,
  };
};
