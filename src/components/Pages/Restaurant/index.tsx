import Button from "@dine-desk/Common/Components/Button";
import CustomTable from "@dine-desk/Common/Components/Table";
import { ConfirmModal } from "@dine-desk/Common/Components/Modal";
import useRestaurantManagement from "./hooks";
import AddEditRestaurant from "./AddEditRestaurant";

const Restaurant = () => {
  const {
    data,
    isDataLoading,
    columns,
    handleConfirmArchiveModal,
    handleToggleModal,
    isRestaurantArchivePending,
    openAddEditRestaurantModal,
    selectedRestaurant,
    setOpenAddEditRestaurantModal,
    setSelectedRestaurant,
    openRestaurantArchiveModal,
    setOpenRestaurantArchiveModal,
  } = useRestaurantManagement();

  return (
    <div>
      <h2 className="text-xl font-bold">Manage Restaurants</h2>

      {/* Add Restaurant Button */}
      <div className="my-4">
        <Button
          onClick={() => {
            setSelectedRestaurant(null);
            setOpenAddEditRestaurantModal(true);
          }}
          title="Add Restaurant"
          variant="filled"
          className="px-6 py-3 rounded-lg text-black cursor-pointer bg-blue-600"
        />
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[300px]">
          <CustomTable
            data={data}
            columns={columns}
            isLoading={isDataLoading}
          />
        </div>
      </div>

      {/* Add/Edit Restaurant Modal */}
      {openAddEditRestaurantModal && (
        <AddEditRestaurant
          onClose={() => {
            setOpenAddEditRestaurantModal(false);
            setSelectedRestaurant(null);
          }}
          open={openAddEditRestaurantModal}
          isEdit={!!selectedRestaurant}
          id={selectedRestaurant?.value}
        />
      )}

      <ConfirmModal
        width="sm"
        isLoading={isRestaurantArchivePending}
        open={openRestaurantArchiveModal}
        onConfirm={() => {
          if (selectedRestaurant?.value !== undefined) {
            handleConfirmArchiveModal(+selectedRestaurant?.value);
          }
        }}
        showCancel
        cancelButtonTitle="Cancel"
        cancelButtonClassName="bg-white border border-gray-300 cursor-pointer"
        titleClassName="text-gray-600"
        onClose={() => {
          setSelectedRestaurant(null);
          handleToggleModal(setOpenRestaurantArchiveModal);
        }}
        iconName={"archive"}
        header="Are you sure?"
        message={`Are you sure you want to delete this restaurant?`}
        confirmButtonTitle={`Yes, Archive`}
        buttonClassName={"bg-red-900 hover:bg-red-500 cursor-pointer"}
      ></ConfirmModal>
    </div>
  );
};

export default Restaurant;
