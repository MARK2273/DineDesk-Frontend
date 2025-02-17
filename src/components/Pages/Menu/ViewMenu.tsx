import { useEffect, useState } from "react";
import {
  useCreateItem,
  useGetItemList,
  useUpdateItems,
} from "@dine-desk/api/item";
import { useForm, useFieldArray } from "react-hook-form";
import { ItamData, itemSchema } from "@dine-desk/schema/menu";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@dine-desk/Common/Components/Button";
import CheckboxField from "@dine-desk/Common/Components/FormField/CheckBoxField";
import InputField from "@dine-desk/Common/Components/FormField/InputField";
import { ROUTES } from "@dine-desk/constants/RoutePath";

type MenuItem = {
  name: string;
  price: string;
  category: string;
  description: string;
  available?: boolean;
  menuId?: string;
};

const transformMenuData = (
  data: { items?: (MenuItem & { id?: string })[] },
  menuId?: string
) => {
  if (data.items && data.items.length > 0)
    return data.items.map((item) => {
      const transformedItem: MenuItem & { id?: string } = {
        menuId,
        name: item.name,
        price: item.price, // Convert price to a number
        category: item.category,
        description: item.description,
        available: item.available || false,
      };
      if (item.id) {
        transformedItem.id = item.id;
      }
      return transformedItem;
    });
};

const ViewMenu = () => {
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
      defaultValues: {
        items: [],
      },
      resolver: yupResolver(itemSchema),
    });

  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    if (data) {
      reset({
        items: data.map((item: MenuItem & { id?: string }) => ({
          id: item.id,
          name: item.name,
          price: item.price.toString(),
          category: item.category,
          description: item.description,
          available: item.available ?? false,
        })),
      });
    }
    setIsEdit(data?.length > 0 ? true : false);
  }, [dataUpdatedAt, reset]);

  const onSubmit = async (data: ItamData) => {
    try {
      const finalData = transformMenuData(data, menuId);
      if (isEdit) {
        await updateItems(finalData);
      } else {
        await createItems(finalData);
      }
      navigate(ROUTES.MENU.path);
      console.log({ finalData });
    } catch (error) {
      console.error(error);
      alert("Error adding items");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-300">
        <h4 className="text-xl font-semibold text-gray-900">Add Items</h4>
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
          className="py-2 px-5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium transition-all cursor-pointer"
        />
      </div>

      <div className="p-6 flex flex-col gap-6">
        {isLoading ? (
          <p>Loading items...</p>
        ) : (
          fields.map((_, index) => (
            <div className="flex gap-4 p-4 rounded-lg" key={index}>
              <CheckboxField
                id={`items.${index}.available`}
                label=""
                checked={watch(`items.${index}.available`)}
                onChange={(e) =>
                  setValue(`items.${index}.available`, e.target.checked, {
                    shouldValidate: true,
                  })
                }
                className="mt-6 cursor-pointer"
              />
              <div className="grid grid-cols-5 gap-4 rounded-lg">
                <InputField
                  label="Item Name"
                  name={`items.${index}.name`}
                  register={register}
                  error={errors?.items?.[index]?.name?.message}
                  placeholder="Enter Item Name"
                />
                <InputField
                  label="Item Price"
                  name={`items.${index}.price`}
                  register={register}
                  error={errors?.items?.[index]?.price?.message}
                  placeholder="Enter Price"
                />
                <InputField
                  label="Item Category"
                  name={`items.${index}.category`}
                  register={register}
                  error={errors?.items?.[index]?.category?.message}
                  placeholder="Enter Category"
                />
                <InputField
                  label="Item Description"
                  name={`items.${index}.description`}
                  register={register}
                  error={errors?.items?.[index]?.description?.message}
                  placeholder="Enter Description"
                />
                <Button
                  variant="filled"
                  title="Remove"
                  onClick={() => remove(index)}
                  className="py-2 px-5 cursor-pointer rounded-lg text-white bg-red-500 hover:bg-red-600 text-sm font-medium transition-all mt-6"
                />
              </div>
            </div>
          ))
        )}

        <Button
          variant="filled"
          title="Save"
          onClick={handleSubmit(onSubmit)}
          isLoading={isItemCreatePending || isItemUpdatePending}
          className="px-6 py-3 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
        />
      </div>
    </div>
  );
};

export default ViewMenu;
