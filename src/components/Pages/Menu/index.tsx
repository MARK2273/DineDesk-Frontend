import AddMenu from "./AddMenu";
import Button from "@dine-desk/Common/Components/Button";
import CustomTable from "@dine-desk/Common/Components/Table";
import useMenuManagement from "./hooks";
import { ConfirmModal } from "@dine-desk/Common/Components/Modal";
import ViewQR from "./ViewQR";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import { PlusIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Menu = () => {
  const {
    data,
    isDataLoading,
    columns,
    openAddOrderModal,
    setOpenAddOrderModal,
    selectedMenu,
    setSelectedMenu,
    openMenuArchiveConfirmationModal,
    setOpenMenuArchiveConfirmationModal,
    openQRModal,
    setOpenQRModal,
    handleConfirmArchiveModal,
    isMenuArchivePending,
    currentPage,
    setCurrentPage,
    totalRows,
  } = useMenuManagement();

  if (isDataLoading) {
    return <SectionLoader className="min-h-[60vh]" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-center mb-8"
        >
          <Button
            onClick={() => {
              setSelectedMenu(null);
              setOpenAddOrderModal(true);
            }}
            title="Add Menu"
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
        >
          <CustomTable
            data={data}
            columns={columns}
            isLoading={false}
            setCurrentPage={setCurrentPage}
            currentPage={
              typeof currentPage === "string"
                ? parseInt(currentPage, 10)
                : currentPage
            }
            totalRows={
              typeof totalRows === "string"
                ? parseInt(totalRows, 10)
                : totalRows
            }
            className="border-0"
            rowClassName="hover:bg-yellow-50"
            headerClassName="bg-gray-50 text-gray-700 font-medium"
          />
        </motion.div>

        {/* Add/Edit Menu Modal */}
        <AddMenu
          onClose={() => {
            setOpenAddOrderModal(false);
            setSelectedMenu(null);
          }}
          open={openAddOrderModal}
          isEdit={!!selectedMenu}
          id={selectedMenu?.id}
        />

        {/* QR View Modal */}
        <ViewQR
          onClose={() => {
            setOpenQRModal(false);
            setSelectedMenu(null);
          }}
          open={openQRModal}
          id={selectedMenu?.id}
        />

        {/* Archive Confirmation Modal */}
        <ConfirmModal
          width="md"
          open={openMenuArchiveConfirmationModal}
          onClose={() => {
            setSelectedMenu(null);
            setOpenMenuArchiveConfirmationModal(false);
          }}
          onConfirm={() => {
            if (selectedMenu?.id !== undefined) {
              handleConfirmArchiveModal(+selectedMenu?.id);
            }
          }}
          showCancel
          cancelButtonTitle="Cancel"
          cancelButtonClassName="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          isLoading={isMenuArchivePending}
          header="Archive Menu"
          message="This will remove the menu from active listings. You can restore it later if needed."
          confirmButtonTitle="Archive"
          buttonClassName="bg-red-600 hover:bg-red-700 text-white"
          iconName="archive"
        />
      </div>
    </motion.div>
  );
};

export default Menu;
