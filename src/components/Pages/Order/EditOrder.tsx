import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetItemList } from "@dine-desk/api/item";
import { useGetOrderDetails, useUpdateOrder } from "@dine-desk/api/order";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import NotFound from "@dine-desk/Common/Components/NotFound";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { extractErrors, OrderStatus } from "@dine-desk/helper";
import Button from "@dine-desk/Common/Components/Button";
import clsx from "clsx";
import CustomSelect from "@dine-desk/Common/Components/FormField/CustomSelect";
import { OptionType } from "@dine-desk/Common/Components/FormField/CustomSelect";
import { MultiValue, SingleValue } from "react-select";

export const statusOptions = Object.values(OrderStatus).map((status) => ({
  value: status,
  label: status.charAt(0).toUpperCase() + status.slice(1),
}));

interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
  image: string[];
  description?: string;
}

interface SelectedItem {
  id: number;
  itemName: string;
  price: number;
  quantity: number;
  notes?: string;
}

const EditOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<OptionType>(statusOptions[0]);
  const [itemNotes, setItemNotes] = useState<Record<number, string>>({});
  const { mutateAsync: updateOrder, isPending: isUpdateOrderPending } =
    useUpdateOrder();

  if (!orderId) return <NotFound path={ROUTES.ORDER.path} />;

  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useGetOrderDetails(Number(orderId));

  const menuId = orderData?.menuId;

  const {
    data: menuItemsData,
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useGetItemList(menuId ?? 0);

  useEffect(() => {
    if (orderData) {
      setSelectedItems(orderData.items || []);
      const initialStatus =
        statusOptions.find((option) => option.value === orderData.status) ||
        statusOptions[0];
      setOrderStatus(initialStatus);

      // Initialize notes
      const notes: Record<number, string> = {};
      orderData.items?.forEach((item: any) => {
        if (item.notes) {
          notes[item.id] = item.notes;
        }
      });
      setItemNotes(notes);
    }
  }, [orderData]);

  useEffect(() => {
    const price = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(price);
  }, [selectedItems]);

  const updateQuantity = (item: MenuItem | SelectedItem, delta: number) => {
    setSelectedItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);

      if (!existingItem && delta > 0) {
        return [
          ...prev,
          {
            id: item.id,
            itemName: "name" in item ? item.name : item.itemName,
            price: item.price,
            quantity: 1,
            notes: itemNotes[item.id] || "",
          },
        ];
      } else if (existingItem) {
        const updated = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + delta } : i
        );
        return updated.filter((i) => i.quantity > 0);
      }

      return prev;
    });
  };

  const updateItemNotes = (id: number, notes: string) => {
    setItemNotes((prev) => ({ ...prev, [id]: notes }));
    setSelectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const removeItem = (id: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemQuantity = (id: number): number => {
    return selectedItems.find((i) => i.id === id)?.quantity || 0;
  };

  // const handleStatusChange = (newValue: OptionType) => {
  //   setOrderStatus(newValue);
  // };

  const handleStatusChange = (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>
  ) => {
    if (newValue && !Array.isArray(newValue)) {
      setOrderStatus(newValue as OptionType);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        orderId: orderData?.orderId,
        status: orderStatus.value,
        items: selectedItems.map((item) => ({
          id: item.id,
          itemName: item.itemName,
          price: item.price,
          quantity: item.quantity,
          notes: item.notes || "",
        })),
      };

      await updateOrder(payload);
      dispatchToast("success", "Order updated successfully");
      navigate(ROUTES.ORDER.path);
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  if (isOrderLoading || isMenuLoading)
    return <SectionLoader className="min-h-[60vh]" />;
  if (isOrderError || isMenuError) return <NotFound path={ROUTES.ORDER.path} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Order #{orderData?.orderId}
          </h1>
          <p className="text-gray-500 mt-1">
            Customer: {orderData?.customerName || "Walk-in"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.ORDER.path)}
            className="border-gray-300"
          >
            Back to Orders
          </Button>

          <div className="w-40">
            {/* <CustomSelect
              options={statusOptions}
              value={orderStatus}
              onChange={handleStatusChange}
              isClearable={false}
            /> */}
            <CustomSelect
              options={statusOptions}
              value={orderStatus}
              onChange={handleStatusChange}
              placeholder="Select Status"
              isClearable={false}
              isDisabled={false}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Menu Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {menuItemsData?.data
                ?.filter((item: MenuItem) => item.available)
                .map((item: MenuItem) => {
                  const quantity = getItemQuantity(item.id);
                  return (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                      <div className="relative aspect-square">
                        <img
                          src={item.image[0] || "/placeholder-food.jpg"}
                          alt={item.name}
                          className="absolute h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </div>
                          {quantity > 0 && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              {quantity} in order
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {item.description}
                          </p>
                        )}
                        <div className="mt-3 flex justify-between items-center">
                          <Button
                            variant={quantity > 0 ? "outline" : "filled"}
                            size="sm"
                            onClick={() => updateQuantity(item, 1)}
                            className={clsx("w-full", {
                              "bg-yellow-600 hover:bg-yellow-700 text-white":
                                quantity === 0,
                              "border-yellow-500 text-yellow-600": quantity > 0,
                            })}
                          >
                            {quantity > 0 ? "Add More" : "Add to Order"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8">
                {/* <Icon
                  name="shoppingCart"
                  className="mx-auto h-12 w-12 text-gray-400"
                /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="mt-2 text-gray-500">No items in order</p>
                <p className="text-sm text-gray-400">Add items from the menu</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.itemName}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="none"
                            size="sm"
                            onClick={() => updateQuantity(item, -1)}
                            className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition cursor-pointer"
                            title="-"
                          />
                          <span className="w-6 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="none"
                            size="sm"
                            onClick={() => updateQuantity(item, 1)}
                            title="+"
                            className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* <div className="mt-2">
                        <input
                          type="text"
                          value={itemNotes[item.id] || ""}
                          onChange={(e) =>
                            updateItemNotes(item.id, e.target.value)
                          }
                          placeholder="Add notes (e.g., no onions)"
                          className="w-full text-sm border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        />
                      </div> */}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  {/* <div className="flex justify-between font-medium text-gray-900">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div> */}
                  {/* <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Tax</span>
                    <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between font-bold text-lg mt-3">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                    {/* <span>₹{(totalPrice * 1.05).toFixed(2)}</span> */}
                  </div>
                </div>

                <Button
                  variant="filled"
                  className="w-full mt-6 bg-yellow-600 hover:bg-yellow-700"
                  size="lg"
                  onClick={handleSubmit}
                  isLoading={isUpdateOrderPending}
                >
                  Update Order
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
