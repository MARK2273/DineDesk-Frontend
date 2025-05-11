import Button from "@dine-desk/Common/Components/Button";
import CustomTable from "@dine-desk/Common/Components/Table";
import { ConfirmModal } from "@dine-desk/Common/Components/Modal";
import useRestaurantManagement from "./hooks";
import AddEditRestaurant from "./AddEditRestaurant";
import { PlusIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Restaurant = () => {
  const {
    data,
    isDataLoading,
    columns,
    handleConfirmArchiveModal,
    isRestaurantArchivePending,
    openAddEditRestaurantModal,
    selectedRestaurant,
    setOpenAddEditRestaurantModal,
    setSelectedRestaurant,
    openRestaurantArchiveModal,
    setOpenRestaurantArchiveModal,
  } = useRestaurantManagement();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className=" min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-center mb-8"
        >
          <Button
            onClick={() => {
              setSelectedRestaurant(null);
              setOpenAddEditRestaurantModal(true);
            }}
            title="Add Restaurant"
            variant="filled"
            icon={<PlusIcon className="h-5 w-5 mr-2" />}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          />
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <CustomTable
              data={data}
              columns={columns}
              isLoading={isDataLoading}
              rowClassName="hover:bg-yellow-50"
              headerClassName="bg-gray-50 text-gray-700 font-medium"
            />
          </div>
        </motion.div>

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

        {/* Archive Confirmation Modal */}
        <ConfirmModal
          width="md"
          isLoading={isRestaurantArchivePending}
          open={openRestaurantArchiveModal}
          onConfirm={() => {
            if (selectedRestaurant?.value !== undefined) {
              handleConfirmArchiveModal(+selectedRestaurant?.value);
            }
          }}
          showCancel
          cancelButtonTitle="Cancel"
          cancelButtonClassName="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          titleClassName="text-gray-800 font-medium"
          onClose={() => {
            setSelectedRestaurant(null);
            setOpenRestaurantArchiveModal(false);
          }}
          iconName="archive"
          header="Archive Restaurant"
          message="This action will remove the restaurant from active listings. You can restore it later if needed."
          confirmButtonTitle="Confirm Archive"
          buttonClassName="bg-red-600 hover:bg-red-700 text-white"
        />
      </div>
    </motion.div>
  );
};

export default Restaurant;
