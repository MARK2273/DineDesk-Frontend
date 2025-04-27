import {
  useCreateRestaurant,
  useGetRestaurant,
  useUpdateRestaurant,
} from "@dine-desk/api/restaurant";
import Button from "@dine-desk/Common/Components/Button";
import FileUpload from "@dine-desk/Common/Components/FormField/FileUpload";
import InputField from "@dine-desk/Common/Components/FormField/InputField";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import Modal from "@dine-desk/Common/Components/Modal";
import { extractErrors } from "@dine-desk/helper";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { RestaurantData, restaurantSchema } from "@dine-desk/schema/restaurant";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AddEditRestaurantModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  id?: string;
}
const AddEditRestaurant: React.FC<AddEditRestaurantModalProps> = ({
  onClose,
  open,
  isEdit,
  id,
}) => {
  const { data, dataUpdatedAt, isLoading } = useGetRestaurant(id);
  const initialValues = data ? { ...data } : {};
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<RestaurantData>({
    resolver: yupResolver(restaurantSchema),
    defaultValues: initialValues,
  });
  const image = watch("image");

  useEffect(() => reset(initialValues), [dataUpdatedAt]);

  const {
    mutateAsync: updateRestaurant,
    isPending: isUpdateRestaurantPending,
  } = useUpdateRestaurant(id);
  const {
    mutateAsync: createRestaurant,
    isPending: isCreateRestaurantPending,
  } = useCreateRestaurant();

  const onSubmit = async (data: RestaurantData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      if (data.image && data.image.length > 0) {
        data.image.forEach((fileOrUrl) => {
          if (typeof fileOrUrl === "string") {
            formData.append("image", fileOrUrl);
          } else if (fileOrUrl instanceof File) {
            formData.append("image", fileOrUrl);
          }
        });
      }

      if (isEdit) {
        await updateRestaurant(formData);
        dispatchToast("success", "Restaurant updated successfully");
      } else {
        await createRestaurant(formData);
        dispatchToast("success", "Restaurant created successfully");
      }

      reset();
      onClose();
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  if (isLoading) {
    return <SectionLoader />;
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Restaurant" : "Add Restaurant"}
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
            disabled={isCreateRestaurantPending || isUpdateRestaurantPending}
          />
          <Button
            variant="filled"
            title={isEdit ? "Update" : "Save"}
            onClick={handleSubmit(onSubmit)}
            className="px-6 py-3 rounded-lg !bg-blue-100 border border-solid !border-blue-500 !text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            isLoading={isCreateRestaurantPending || isUpdateRestaurantPending}
          />
        </div>
      }
    >
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-white ">
          <InputField
            label="Restaurant Name"
            name="name"
            error={errors?.name?.message}
            register={register}
            inputClass="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <FileUpload
            value={image}
            onChange={(files) => setValue("image", files)}
            error={errors?.image?.message}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditRestaurant;
