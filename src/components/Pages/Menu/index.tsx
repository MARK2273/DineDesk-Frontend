import AddMenu from "./AddMenu";
import Button from "@dine-desk/Common/Components/Button";
import CustomTable from "@dine-desk/Common/Components/Table";
import useMenuManagement from "./hooks";
import { ConfirmModal } from "@dine-desk/Common/Components/Modal";

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
    handleConfirmArchiveModal,
    handleToggleModal,
    isMenuArchivePending,
  } = useMenuManagement();

  return (
    <div>
      <h2 className="text-xl font-bold">Manage Menus</h2>

      {/* Add Menu Button */}
      <div className="my-4">
        <Button
          onClick={() => {
            setSelectedMenu(null);
            setOpenAddOrderModal(true);
          }}
          title="Add Menu"
          variant="filled"
          className="px-6 py-3 rounded-lg text-black cursor-pointer bg-blue-600"
        />
      </div>

      <CustomTable data={data} columns={columns} isLoading={isDataLoading} />

      {/* Add/Edit Menu Modal */}
      {openAddOrderModal && (
        <AddMenu
          onClose={() => {
            setOpenAddOrderModal(false);
            setSelectedMenu(null);
          }}
          open={openAddOrderModal}
          isEdit={!!selectedMenu}
          id={selectedMenu?.id}
        />
      )}

      <ConfirmModal
        width="sm"
        isLoading={isMenuArchivePending}
        open={openMenuArchiveConfirmationModal}
        onConfirm={() => {
          if (selectedMenu?.id !== undefined) {
            handleConfirmArchiveModal(+selectedMenu?.id);
          }
        }}
        showCancel
        cancelButtonTitle="Cancel"
        cancelButtonClassName="bg-white border border-gray-300 cursor-pointer"
        titleClassName="text-gray-600"
        onClose={() => {
          setSelectedMenu(null);
          handleToggleModal(setOpenMenuArchiveConfirmationModal);
        }}
        iconName={"archive"}
        header="Are you sure?"
        message={`Are you sure you want to delete this menu?`}
        confirmButtonTitle={`Yes, Archive`}
        buttonClassName={"bg-red-900 hover:bg-red-500 cursor-pointer"}
      ></ConfirmModal>
    </div>
  );
};

export default Menu;
