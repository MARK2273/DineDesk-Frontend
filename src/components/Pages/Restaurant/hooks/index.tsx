import {
  useArchiveRestaurant,
  useGetRestaurantList,
} from "@dine-desk/api/restaurant";
import Icon from "@dine-desk/Common/Components/Icon";
import { useTableManagement } from "@dine-desk/Common/Components/Table";
import Tooltip from "@dine-desk/Common/Components/ToolTip";
import { extractErrors } from "@dine-desk/helper";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo, useState } from "react";

export interface RestaurantManagementType {
  id: string;
  name: string;
}
const useRestaurantManagement = () => {
  const [openAddEditRestaurantModal, setOpenAddEditRestaurantModal] =
    useState<boolean>(false);
  const [openRestaurantArchiveModal, setOpenRestaurantArchiveModal] =
    useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const { apiData } = useTableManagement<RestaurantManagementType, object>({
    apiCall: useGetRestaurantList,
    initialQueryParams: {},
  });
  const {
    mutateAsync: archiveRestaurant,
    isPending: isRestaurantArchivePending,
  } = useArchiveRestaurant();

  const handleToggleModal = (
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    modalSetter((prev) => !prev);
  };

  const handleConfirmArchiveModal = async (id: number) => {
    try {
      await archiveRestaurant(+id);
      dispatchToast("success", "Restaurant archived successfully");
      handleToggleModal(setOpenRestaurantArchiveModal);
      setSelectedRestaurant(null);
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  const { data, isLoading: isDataLoading, dataUpdatedAt } = apiData;

  const columns: ColumnDef<RestaurantManagementType>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }: { row: Row<RestaurantManagementType> }) => {
          return row?.original?.name;
        },
        enableSorting: false,
      },
      {
        accessorKey: "action",
        header: "Action",
        enableSorting: false,
        cell: ({ row }: { row: Row<RestaurantManagementType> }) => (
          <div className="flex items-center justify-self-auto gap-2">
            <Tooltip content="Edit" placement="top">
              <button
                className="bg-blue-100 hover:bg-blue-500 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-blue-500 hover:text-white transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  setOpenAddEditRestaurantModal(true);
                  setSelectedRestaurant(row.original);
                }}
              >
                <Icon name="edit" />
              </button>
            </Tooltip>

            {/* View Button */}
            {/* <Tooltip content="View" placement="top">
              <button
                className="cursor-pointer bg-green-100 hover:bg-green-500 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-green-600 hover:text-white transition duration-300 ease-in-out"
                onClick={() => {
                  navigate(ROUTES.ADD_EDIT_MENU.navigatePath(row.original.id));
                }}
              >
                <Icon name="eye" className="w-5 h-5" />
              </button>
            </Tooltip> */}

            {/* Archive Button */}
            <Tooltip content="Archive" placement="top">
              <button
                className="cursor-pointer bg-red-100 hover:bg-red-500 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-red-600 hover:text-white transition duration-300 ease-in-out"
                onClick={() => {
                  setSelectedRestaurant(row.original);
                  setOpenRestaurantArchiveModal(true);
                }}
              >
                <Icon name="archive" className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [dataUpdatedAt]
  );

  return {
    columns,
    data,
    isDataLoading,
    setSelectedRestaurant,
    handleConfirmArchiveModal,
    handleToggleModal,
    isRestaurantArchivePending,
    openAddEditRestaurantModal,
    setOpenAddEditRestaurantModal,
    selectedRestaurant,
    openRestaurantArchiveModal,
    setOpenRestaurantArchiveModal,
  };
};

export default useRestaurantManagement;
