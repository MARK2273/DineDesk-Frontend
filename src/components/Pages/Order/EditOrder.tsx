import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetItemList } from "@dine-desk/api/item";
import { useGetOrderDetails, useUpdateOrder } from "@dine-desk/api/order";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import NotFound from "@dine-desk/Common/Components/NotFound";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { extractErrors } from "@dine-desk/helper";
import Button from "@dine-desk/Common/Components/Button";
import clsx from "clsx";

// TYPES
interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
  image: string[];
}

interface SelectedItem {
  id: number;
  itemName: string;
  price: number;
  quantity: number;
}

const EditOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const { mutateAsync: updateOrder, isPending: isUpdateOrderPending } =
    useUpdateOrder();

  if (!orderId) return <NotFound path="/" />;

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
      setOrderStatus(orderData.status || "pending");
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

  const removeItem = (id: number) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemQuantity = (id: number): number => {
    return selectedItems.find((i) => i.id === id)?.quantity || 0;
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderStatus(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        orderId: orderData?.orderId,
        status: orderStatus,
        items: selectedItems,
      };

      console.log("Submit payload:", payload);
      await updateOrder(payload);
      dispatchToast("success", "Order updated successfully");
      navigate(ROUTES.ORDER.path);
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isOrderLoading || isMenuLoading) return <SectionLoader />;
  if (isOrderError || isMenuError)
    return (
      <div className="text-red-500 text-center p-4">Error loading data</div>
    );

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Order Id #{orderData?.orderId}
        </h2>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              orderStatus
            )}`}
          >
            {orderStatus.toUpperCase()}
          </div>

          <select
            value={orderStatus}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Items Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Selected Items
            </h3>

            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
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
                <p className="mt-2">No items selected</p>
                <p className="text-sm">Add items from the menu below</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {selectedItems.map((item) => (
                  <li key={item.id} className="py-3">
                    <div className="flex justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.itemName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="filled"
                          className="w-8 h-8 rounded-full bg-blue-100 text-gray-600 flex items-center justify-center hover:bg-blue-200 transition cursor-pointer"
                          titleClassName="text-gray-600"
                          onClick={() => updateQuantity(item, -1)}
                          title="-"
                        />
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="filled"
                          className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition cursor-pointer"
                          titleClassName="text-blue-600"
                          onClick={() => updateQuantity(item, 1)}
                          title="+"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Menu Items Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Available Menu Items
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {menuItemsData?.data
                ?.filter((item: MenuItem) => item.available)
                .map((item: MenuItem) => {
                  const quantity = getItemQuantity(item.id);
                  return (
                    <div
                      key={item.id}
                      className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition"
                    >
                      <div className="relative pb-3/4 h-32">
                        <img
                          src={item.image[0]}
                          alt={item.name}
                          className="absolute h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ₹{item.price.toFixed(2)}
                        </p>
                        {quantity === 0 ? (
                          <Button
                            variant="filled"
                            className="mt-2 w-full py-1 bg-blue-600 rounded hover:bg-blue-700 transition"
                            titleClassName="text-white text-sm"
                            onClick={() => updateQuantity(item, 1)}
                            title="Add"
                          />
                        ) : (
                          <div className="flex items-center justify-between mt-2">
                            <Button
                              variant="filled"
                              className="w-7 h-7 rounded bg-blue-100 cursor-pointer flex items-center justify-center hover:bg-blue-200 transition"
                              titleClassName="text-gray-600"
                              onClick={() => updateQuantity(item, -1)}
                              title="-"
                            />
                            <span className="text-sm font-medium">
                              {quantity}
                            </span>
                            <Button
                              variant="filled"
                              className="w-7 h-7 rounded bg-blue-100 cursor-pointer flex items-center justify-center hover:bg-blue-200 transition"
                              titleClassName="text-blue-600"
                              onClick={() => updateQuantity(item, 1)}
                              title="+"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.itemName} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-medium text-gray-900">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  orderStatus
                )}`}
              >
                {orderStatus.toUpperCase()}
              </div>
            </div>

            <Button
              variant="filled"
              className={clsx(
                "mt-6 w-full !py-2 px-4 rounded-md font-medium transition cursor-pointer",
                {
                  "bg-gray-300 text-gray-500 !cursor-not-allowed":
                    selectedItems.length === 0,
                  "bg-green-600 text-white hover:bg-green-700":
                    selectedItems.length > 0,
                }
              )}
              title="Update Order"
              disabled={selectedItems.length === 0 || isUpdateOrderPending}
              isLoading={isUpdateOrderPending}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
