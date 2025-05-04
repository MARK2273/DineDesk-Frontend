import { useGetOrderList } from "@dine-desk/api/order";
import Icon from "@dine-desk/Common/Components/Icon";
import { useTableManagement } from "@dine-desk/Common/Components/Table";
import Tooltip from "@dine-desk/Common/Components/ToolTip";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { formatDate, getStatusColor, OrderStatus } from "@dine-desk/helper";
import { RootState } from "@dine-desk/redux/store";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  id: number;
  orderId: number;
  itemId: number;
  quantity: number;
  price: number;
  createdAt: string;
}

interface Order {
  id: number;
  restaurantId: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  orderItems: OrderItem[];
}

interface OrderListResponse {
  data: Order[];
  currentPage: number;
  total: number;
}

export const useOrderManagement = () => {
  const selectedRestaurant = useSelector(
    (state: RootState) => state.restaurant?.selectedRestaurant
  );
  const navigate = useNavigate();

  const restaurantId = selectedRestaurant?.id;
  const { apiData, setCurrentPage, currentPage } = useTableManagement<
    OrderListResponse,
    { restaurantId: string | number }
  >({
    apiCall: useGetOrderList,
    initialQueryParams: {
      restaurantId: restaurantId || "",
    },
  });
  const { data, isLoading: isDataLoading, dataUpdatedAt } = apiData;

  console.log(data, "order data");

  const columns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        id: "orderId",
        accessorKey: "orderId",
        header: "Order ID",
        cell: ({ row }) => {
          return row?.original?.id;
        },
      },
      {
        id: "orderStatus",
        accessorKey: "orderStatus",
        header: "Order Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      },
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({ row }) => {
          return <span>₹{row.original.totalAmount.toFixed(2)}</span>;
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Order Date",
        cell: ({ row }) => {
          return (
            <span className="text-gray-600">
              {formatDate(row.original.createdAt)}
            </span>
          );
        },
      },
      {
        accessorKey: "action",
        header: "Action",
        enableSorting: false,
        cell: ({ row }) => (
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
