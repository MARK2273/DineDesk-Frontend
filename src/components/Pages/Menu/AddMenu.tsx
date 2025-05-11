import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@dine-desk/Common/Components/Button";
import { MenuData, menuSchema } from "@dine-desk/schema/menu";
import InputField from "@dine-desk/Common/Components/FormField/InputField";
import Modal from "@dine-desk/Common/Components/Modal";
import { useCreateMenu, useGetMenu, useUpdateMenu } from "@dine-desk/api/menu";
import { useEffect } from "react";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { extractErrors } from "@dine-desk/helper";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import { storageHelper } from "@dine-desk/helper/storageHelper";

interface AddEditMenuModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  id?: string;
}

const AddEditMenu: React.FC<AddEditMenuModalProps> = ({
  open,
  onClose,
  isEdit = false,
  id,
}) => {
  const { data, dataUpdatedAt, isLoading } = useGetMenu(id);
  const { mutateAsync: updateMenu, isPending: isUpdateMenuPending } =
    useUpdateMenu(id);
  const { mutateAsync: createMenu, isPending: isCreateMenuPending } =
    useCreateMenu();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<MenuData>({
    resolver: yupResolver(menuSchema),
    defaultValues: data || { name: "" },
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [dataUpdatedAt]);

  const onSubmit = async (formData: MenuData) => {
    try {
      const storage = storageHelper("session");
      const restaurantId = storage.getItem("restaurantId");

      if (isEdit) {
        await updateMenu(formData);
        dispatchToast("success", "Menu updated successfully");
      } else {
        if (!restaurantId) {
          dispatchToast("error", "Please select a restaurant");
          return;
        }
        await createMenu({ ...formData, restaurantId });
        dispatchToast("success", "Menu created successfully");
      }
      reset();
      onClose();
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <SectionLoader />
      </div>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Menu" : "Create New Menu"}
      width="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          label="Menu Name"
          name="name"
          error={errors?.name?.message}
          register={register}
          placeholder="Enter menu name"
          inputClass="w-full"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isCreateMenuPending || isUpdateMenuPending}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            type="submit"
            isLoading={isCreateMenuPending || isUpdateMenuPending}
            disabled={!isDirty || isCreateMenuPending || isUpdateMenuPending}
            className="min-w-[100px] bg-yellow-600 hover:bg-yellow-700"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEditMenu;
