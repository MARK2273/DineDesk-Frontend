import { useEffect, useState } from "react";
import {
  useCreateItem,
  useGetItemList,
  useUpdateItems,
} from "@dine-desk/api/item";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useForm,
  useFieldArray,
  FieldArrayWithId,
  UseFormRegister,
  UseFieldArrayRemove,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { ItamData, itemSchema } from "@dine-desk/schema/menu";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@dine-desk/Common/Components/Button";
import CheckboxField from "@dine-desk/Common/Components/FormField/CheckBoxField";
import InputField from "@dine-desk/Common/Components/FormField/InputField";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { extractErrors } from "@dine-desk/helper";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import { storageHelper } from "@dine-desk/helper/storageHelper";
import FileUpload from "@dine-desk/Common/Components/FormField/FileUpload";
import clsx from "clsx";
import { motion } from "framer-motion";

type MenuItemType = {
  available?: boolean;
  name: string;
  price: string;
  category: string;
  description: string;
  image: any[];
  menuId?: string;
  id?: string;
};

type DraggableRowProps = {
  field: FieldArrayWithId<{ items?: MenuItemType[] }, "items", "id">;
  index: number;
  register: UseFormRegister<{ items?: MenuItemType[] }>;
  remove: UseFieldArrayRemove;
  watch: UseFormWatch<{ items?: MenuItemType[] }>;
  setValue: UseFormSetValue<{ items?: MenuItemType[] }>;
  errors: FieldErrors<{ items?: MenuItemType[] }>;
};

const AddEditItem = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const { data, isLoading, dataUpdatedAt } = useGetItemList(menuId);
  const [isEdit, setIsEdit] = useState(false);
  const { mutateAsync: createItems, isPending: isItemCreatePending } =
    useCreateItem();
  const { mutateAsync: updateItems, isPending: isItemUpdatePending } =
    useUpdateItems();
  const navigate = useNavigate();

  const { register, control, handleSubmit, reset, formState, watch, setValue } =
    useForm<ItamData>({
      defaultValues: { items: [] },
      resolver: yupResolver(itemSchema),
    });

  const { errors } = formState;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items",
  });

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (data?.data) {
      reset({
        items: data.data.map((item: MenuItemType) => ({
          ...item,
          price: item.price?.toString(),
        })),
      });
    }
    setIsEdit(data?.data?.length > 0);
  }, [dataUpdatedAt, reset]);

  const onSubmit = async (data: ItamData) => {
    try {
      const formData = new FormData();
      const storage = storageHelper("session");
      const restaurantId = storage.getItem("restaurantId");

      if (!restaurantId) {
        dispatchToast("error", "Please select a restaurant");
        return;
      }

      formData.append("restaurantId", restaurantId);

      data.items?.forEach((item, index) => {
        formData.append(`items[${index}][name]`, item.name);
        formData.append(`items[${index}][price]`, item.price.toString());
        formData.append(`items[${index}][category]`, item.category);
        formData.append(`items[${index}][description]`, item.description || "");
        formData.append(
          `items[${index}][available]`,
          item.available ? "true" : "false"
        );
        formData.append(`items[${index}][menuId]`, menuId || "");

        if (item.image?.length > 0) {
          item.image.forEach((fileOrUrl) => {
            if (typeof fileOrUrl === "string") {
              formData.append(`items[${index}][image]`, fileOrUrl);
            } else if (fileOrUrl instanceof File) {
              formData.append(`items[${index}][image]`, fileOrUrl);
            }
          });
        }
      });

      if (isEdit) {
        await updateItems(formData);
        dispatchToast("success", "Menu items updated successfully");
      } else {
        await createItems(formData);
        dispatchToast("success", "Menu items created successfully");
      }

      navigate(ROUTES.MENU.path);
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((item) => item.id === active.id);
    const newIndex = fields.findIndex((item) => item.id === over.id);

    move(oldIndex, newIndex);
  };

  if (isLoading) {
    return <SectionLoader className="min-h-[60vh]" />;
  }

  return (
    // <div className="">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-gray-50 min-h-screen"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex space-x-3">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
          >
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.MENU.path)}
              className="border-gray-300"
            >
              Back to Menu
            </Button>
            <Button
              variant="filled"
              onClick={() =>
                append({
                  name: "",
                  price: "",
                  category: "",
                  description: "",
                  available: true,
                  image: [],
                })
              }
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Add Item
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="space-y-4"
      >
        {fields.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center rounded-lg border border-gray-200 shadow-xs"
          >
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No items added yet</p>
            </div>
          </motion.div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={fields.map((field) => field.id)}>
              {fields.map((field, index) => (
                <DraggableRow
                  key={field.id}
                  field={field}
                  index={index}
                  register={register}
                  remove={remove}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </motion.div>

      {fields.length > 0 && (
        <div className="mt-8 flex justify-end">
          <Button
            variant="filled"
            onClick={handleSubmit(onSubmit)}
            isLoading={isItemCreatePending || isItemUpdatePending}
            className="min-w-[200px] bg-yellow-600 hover:bg-yellow-700"
            size="lg"
          >
            {isEdit ? "Update Items" : "Save Items"}
          </Button>
        </div>
      )}
    </motion.div>
    // </div>
  );
};

const DraggableRow = ({
  index,
  register,
  remove,
  watch,
  setValue,
  errors,
  field,
}: DraggableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const image = watch(`items.${index}.image`);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "flex flex-col lg:flex-row gap-4 p-4 border rounded-lg bg-white",
        "shadow-sm hover:shadow-md transition-shadow",
        isDragging ? "shadow-lg border-yellow-400" : "border-gray-200"
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 cursor-grab"
        aria-label="Drag to reorder"
      >
        {/* <Icon name="dragHandle" className="w-5 h-5" /> */}
        <span
          {...listeners}
          className="text-lg font-bold cursor-grab"
          style={{ touchAction: "none" }}
        >
          ☰
        </span>{" "}
      </button>
      <CheckboxField
        id={`items.${index}.available`}
        label=""
        checked={watch(`items.${index}.available`)}
        onChange={(e) =>
          setValue(`items.${index}.available`, e.target.checked, {
            shouldValidate: true,
          })
        }
        className="mt-1"
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Image upload */}
        <div className="md:col-span-2">
          <FileUpload
            allowedFileTypes={["image/jpeg", "image/png"]}
            value={image}
            onChange={(files) =>
              setValue(`items.${index}.image`, files, { shouldValidate: true })
            }
            error={errors?.items?.[index]?.image?.message}
          />
        </div>

        {/* Form fields */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            label="Name"
            name={`items.${index}.name`}
            register={register}
            error={errors?.items?.[index]?.name?.message}
            placeholder="Item name"
          />
          <InputField
            label="Price"
            name={`items.${index}.price`}
            register={register}
            error={errors?.items?.[index]?.price?.message}
            placeholder="0.00"
            type="number"
          />
          <InputField
            label="Category"
            name={`items.${index}.category`}
            register={register}
            error={errors?.items?.[index]?.category?.message}
            placeholder="Category"
          />
          <InputField
            label="Description"
            name={`items.${index}.description`}
            register={register}
            error={errors?.items?.[index]?.description?.message}
            placeholder="Description"
          />
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => remove(index)}
            className="text-red-600 border-red-200 hover:bg-red-50 w-full"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEditItem;
