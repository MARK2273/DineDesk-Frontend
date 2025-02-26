import { useArchiveMenu, useGetMenuList } from "@dine-desk/api/menu";
import Icon from "@dine-desk/Common/Components/Icon";
import { useTableManagement } from "@dine-desk/Common/Components/Table";
import Tooltip from "@dine-desk/Common/Components/ToolTip";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { extractErrors } from "@dine-desk/helper";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { RootState } from "@dine-desk/redux/store";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export interface MenuManagementType {
  id: string;
  name: string;
}
const useMenuManagement = () => {
  const [openAddOrderModal, setOpenAddOrderModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const [
    openMenuArchiveConfirmationModal,
    setOpenMenuArchiveConfirmationModal,
  ] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  const selectedRestaurant = useSelector(
    (state: RootState) => state.restaurant?.selectedRestaurant
  );

  const restaurantId = selectedRestaurant?.id;

  const { apiData } = useTableManagement<MenuManagementType, object>({
    apiCall: useGetMenuList,
    initialQueryParams: { restaurantId },
  });
  const { mutateAsync: archiveMenu, isPending: isMenuArchivePending } =
    useArchiveMenu();

  const handleToggleModal = (
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    modalSetter((prev) => !prev);
  };

  const handleConfirmArchiveModal = async (id: number) => {
    try {
      await archiveMenu(+id);
      dispatchToast("success", "Order archived successfully");
      handleToggleModal(setOpenMenuArchiveConfirmationModal);
      setSelectedMenu(null);
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  const { data, isLoading: isDataLoading, dataUpdatedAt } = apiData;

  const columns: ColumnDef<MenuManagementType>[] = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }: { row: Row<MenuManagementType> }) => {
          return row?.original?.name;
        },
        enableSorting: false,
      },
      {
        accessorKey: "action",
        header: "Action",
        enableSorting: false,
        cell: ({ row }: { row: Row<MenuManagementType> }) => (
          <div className="flex items-center justify-self-auto gap-2">
            <Tooltip content="Edit" placement="top">
              <button
                className="bg-blue-100 hover:bg-blue-500 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-blue-500 hover:text-white transition duration-300 ease-in-out cursor-pointer"
                onClick={() => {
                  setOpenAddOrderModal(true);
                  setSelectedMenu(row.original);
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
                  navigate(ROUTES.ADD_EDIT_MENU.navigatePath(row.original.id));
                }}
              >
                <Icon name="eye" className="w-5 h-5" />
              </button>
            </Tooltip>

            {/* Archive Button */}
            <Tooltip content="Archive" placement="top">
              <button
                className="cursor-pointer bg-red-100 hover:bg-red-500 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-red-600 hover:text-white transition duration-300 ease-in-out"
                onClick={() => {
                  setSelectedMenu(row.original);
                  setOpenMenuArchiveConfirmationModal(true);
                }}
              >
                <Icon name="archive" className="w-5 h-5" />
              </button>
            </Tooltip>

            {/* View Menu Items */}
            <Tooltip content="QR Code" placement="top">
              <button
                className="cursor-pointer bg-gray-200 hover:bg-gray-800 p-2.5 rounded-lg w-10 h-10 flex items-center justify-center text-gray-800 hover:text-white transition duration-300 ease-in-out"
                onClick={() => {
                  setSelectedMenu(row.original);
                  setOpenQRModal(true);
                }}
              >
                <Icon name="QRCode" className="w-5 h-5" />
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
    openAddOrderModal,
    setOpenAddOrderModal,
    selectedMenu,
    setSelectedMenu,
    openMenuArchiveConfirmationModal,
    setOpenMenuArchiveConfirmationModal,
    openQRModal,
    setOpenQRModal,
    handleConfirmArchiveModal,
    handleToggleModal,
    isMenuArchivePending,
  };
};

export default useMenuManagement;
