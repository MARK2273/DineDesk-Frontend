import { useEffect, useState } from "react";
import {
  useCreateItem,
  useGetItemList,
  useUpdateItems,
} from "@dine-desk/api/item";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
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
import { Skeleton } from "@dine-desk/Common/Components/Skeleton";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { extractErrors } from "@dine-desk/helper";

type MenuItemType = {
  available?: boolean | undefined;
  name: string;
  price: string;
  category: string;
  description: string;
  menuId?: string;
  id?: string;
};

type DraggableRowProps = {
  field: FieldArrayWithId<
    {
      items?: MenuItemType[] | undefined;
    },
    "items",
    "id"
  >;
  index: number;
  register: UseFormRegister<{
    items?: MenuItemType[] | undefined;
  }>;
  remove: UseFieldArrayRemove;
  watch: UseFormWatch<{
    items?: MenuItemType[] | undefined;
  }>;
  setValue: UseFormSetValue<{
    items?: MenuItemType[] | undefined;
  }>;
  errors: FieldErrors<{
    items?: MenuItemType[] | undefined;
  }>;
};

const transformMenuData = (
  data: { items?: MenuItemType[] },
  menuId?: string
) => {
  if (data.items && data.items.length > 0)
    return data.items.map((item) => ({
      ...item,
      menuId,
      available: item.available || false,
    }));
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

  useEffect(() => {
    if (data) {
      reset({
        items: data.map((item: MenuItemType) => ({
          ...item,
          price: item.price.toString(),
        })),
      });
    }
    setIsEdit(data?.length > 0);
  }, [dataUpdatedAt, reset]);

  const onSubmit = async (data: ItamData) => {
    try {
      const finalData = transformMenuData(data, menuId);
      if (isEdit) {
        await updateItems(finalData);
        dispatchToast("success", "Menu updated successfully");
      } else {
        await createItems(finalData);
        dispatchToast("success", "Menu created successfully");
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

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-4">
        <h4 className="text-xl font-semibold">Add Items</h4>
        <Button
          variant="filled"
          onClick={() =>
            append({
              name: "",
              price: "",
              category: "",
              description: "",
              available: false,
            })
          }
          title="Add Item"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm"
        />
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-lg" count={3} />
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={fields.map((field) => field.id)}>
              <div className="space-y-4">
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
              </div>
            </SortableContext>
          </DndContext>
        )}
        {/* Save Button */}
        <Button
          variant="filled"
          title="Save"
          onClick={handleSubmit(onSubmit)}
          isLoading={isItemCreatePending || isItemUpdatePending}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer"
        />
      </div>
    </div>
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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-gray-50 shadow-md"
    >
      <span
        {...listeners}
        className="text-lg font-bold cursor-grab"
        style={{ touchAction: "none" }}
        // onPointerDown={(e) => e.preventDefault()} // Prevent scrolling
      >
        ☰
      </span>
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
        <InputField
          label="Name"
          name={`items.${index}.name`}
          register={register}
          error={errors?.items?.[index]?.name?.message}
          placeholder="Enter Name"
        />
        <InputField
          label="Price"
          name={`items.${index}.price`}
          register={register}
          error={errors?.items?.[index]?.price?.message}
          placeholder="Enter Price"
        />
        <InputField
          label="Category"
          name={`items.${index}.category`}
          register={register}
          error={errors?.items?.[index]?.category?.message}
          placeholder="Enter Category"
        />
        <InputField
          label="Description"
          name={`items.${index}.description`}
          register={register}
          error={errors?.items?.[index]?.description?.message}
          placeholder="Enter Description"
        />
      </div>
      <Button
        variant="filled"
        title="Remove"
        onClick={() => remove(index)}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
      />
    </div>
  );
};

export default AddEditItem;
