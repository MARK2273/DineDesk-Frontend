import { useGetOrderList } from "@dine-desk/api/order";
import Icon from "@dine-desk/Common/Components/Icon";
import { useTableManagement } from "@dine-desk/Common/Components/Table";
import Tooltip from "@dine-desk/Common/Components/ToolTip";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { formatDate } from "@dine-desk/helper";
import { RootState } from "@dine-desk/redux/store";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useOrderManagement = () => {
  const selectedRestaurant = useSelector(
    (state: RootState) => state.restaurant?.selectedRestaurant
  );
  const navigate = useNavigate();

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
      {
        accessorKey: "action",
        header: "Action",
        enableSorting: false,
        cell: ({ row }: { row: Row<any> }) => (
          <div className="flex items-center justify-self-auto gap-2">
            <Tooltip content="Edit" placement="top">
              <button
                className="bg-blue-100 hover:bg-blue-500 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-blue-500 hover:text-white transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  navigate(ROUTES.EDIT_ORDER.navigatePath(row.original.id));
                }}
              >
                <Icon name="edit" />
              </button>
            </Tooltip>

            {/* View Button */}
            <Tooltip content="View" placement="top">
              <button
                className="cursor-pointer bg-green-100 hover:bg-green-500 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-green-600 hover:text-white transition duration-300 ease-in-out"
                onClick={() => {
                  navigate(ROUTES.VIEW_ORDER.navigatePath(row.original.id));
                }}
              >
                <Icon name="eye" className="w-5 h-5" />
              </button>
            </Tooltip>

            {/* Archive Button */}
            {/* <Tooltip content="Archive" placement="top">
              <button
                className="cursor-pointer bg-red-100 hover:bg-red-500 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-red-600 hover:text-white transition duration-300 ease-in-out"
                onClick={() => {
                  setSelectedMenu(row.original);
                  setOpenMenuArchiveConfirmationModal(true);
                }}
              >
                <Icon name="archive" className="w-5 h-5" />
              </button>
            </Tooltip> */}
          </div>
        ),
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
