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
    formState: { errors, isDirty },
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
      title={isEdit ? "Edit Restaurant" : "Add New Restaurant"}
      width="md"
      ParentClassName="backdrop-blur-sm"
      TitleClassname="text-gray-900 font-semibold text-lg"
      // CloseButton={
      //   <button
      //     onClick={onClose}
      //     className="p-1 rounded-full hover:bg-gray-100 transition-colors"
      //   >
      //     <XMarkIcon className="h-5 w-5 text-gray-500" />
      //   </button>
      // }

      footer={
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="filled"
            title="Cancel"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 border-gray-300"
            disabled={isCreateRestaurantPending || isUpdateRestaurantPending}
          />
          <Button
            variant="filled"
            title={isEdit ? "Update Restaurant" : "Create Restaurant"}
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white"
            isLoading={isCreateRestaurantPending || isUpdateRestaurantPending}
            disabled={!isDirty && isEdit}
          />
        </div>
      }
    >
      <div className="space-y-6 py-2">
        <InputField
          label="Restaurant Name"
          name="name"
          error={errors?.name?.message}
          register={register}
          inputClass="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          labelClass="block text-sm font-medium text-gray-700 mb-1"
        />

        <FileUpload
          value={image}
          onChange={(files) => setValue("image", files)}
          error={errors?.image?.message}
          label="Restaurant Image"
        />
      </div>
    </Modal>
  );
};

export default AddEditRestaurant;
