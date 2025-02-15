import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@dine-desk/Common/Components/Button";
import { MenuData, menuSchema } from "@dine-desk/schema/menu";
// import InputField from "@dine-desk/Common/Components/FormField/InputField";
import Modal from "@dine-desk/Common/Components/Modal";
import { useCreateMenu, useGetMenu, useUpdateMenu } from "@dine-desk/api/menu";
import { useEffect } from "react";

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
  const { data, dataUpdatedAt } = useGetMenu(id);
  const { mutateAsync: updateMenu, isPending: isUpdateMenuPending } =
    useUpdateMenu(id);
  const { mutateAsync: createMenu, isPending: isCreateMenuPending } =
    useCreateMenu();
  const initialValues = data ? { ...data } : {};
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MenuData>({
    resolver: yupResolver(menuSchema),
    defaultValues: initialValues,
  });

  useEffect(() => reset(initialValues), [dataUpdatedAt]);

  const onSubmit = async (data: MenuData) => {
    try {
      if (isEdit) {
        await updateMenu(data);
      } else {
        await createMenu(data);
      }
      reset();
      onClose();
    } catch (error) {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Menu" : "Add Menu"}
      width="sm"
      ParentClassName="!bg-opacity-50"
      TitleClassname="!text-Gray-900"
      footer={
        <div className="flex items-center justify-end gap-2.5 mt-10px">
          <Button
            variant="filled"
            title="Cancel"
            className="px-6 py-3 rounded-lg !bg-blue-100 border border-solid !border-blue-500 !text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            onClick={onClose}
            disabled={isCreateMenuPending || isUpdateMenuPending}
          />
          <Button
            variant="filled"
            title={isEdit ? "Update" : "Save"}
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-3 rounded-lg !bg-blue-100 border border-solid !border-blue-500 !text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            isLoading={isCreateMenuPending || isUpdateMenuPending}
          />
        </div>
      }
    >
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white ">
          {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> */}
          {/* <InputField
            label="Menu Name"
            parentClassName="flex items-center gap-4 flex-nowrap"
            labelClass="w-auto whitespace-nowrap"
            name="name"
            error={errors?.name?.message}
            register={register}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          /> */}
          <div className="flex items-center gap-4 flex-nowrap">
            <label className="w-auto whitespace-nowrap">Menu Name</label>
            <input
              {...register("name")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors?.name?.message && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* </form> */}
        </div>
      </div>
    </Modal>
  );
};

export default AddEditMenu;
