import { useEffect, useState } from "react";
import Image from "@dine-desk/Common/Components/Image";
import { useGetItemList } from "@dine-desk/api/item";
import { useParams } from "react-router-dom";
import { Skeleton } from "@dine-desk/Common/Components/Skeleton";
import clsx from "clsx";
import { useCreateOrder } from "@dine-desk/api/order";
import { storageHelper } from "@dine-desk/helper/storageHelper";
import { dispatchToast } from "@dine-desk/helper/toastHelper";
import { extractErrors } from "@dine-desk/helper";

const ViewMenu = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const { data, isLoading, dataUpdatedAt } = useGetItemList(menuId);
  const [groupedMenu, setGroupedMenu] = useState<Record<string, any[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const storage = storageHelper("session");

  const { mutateAsync: createOrder, isPending: isCreateOrderPending } =
    useCreateOrder();

  useEffect(() => {
    if (data?.data) {
      const grouped = data?.data.reduce((acc: any, item: any) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {});
      setGroupedMenu(grouped);
      storage.setItem("restaurantId", data?.restaurantId);
    }
  }, [dataUpdatedAt]);

  const categories = ["All", ...Object.keys(groupedMenu)];

  const handleAdd = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const handleRemove = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const handleSubmitOrder = async () => {
    try {
      if (!data) return;
      const restaurantId = data?.restaurantId;

      if (!restaurantId) {
        dispatchToast("error", "Please select a restaurant");
        return;
      }

      const items = Object.entries(cart).map(([itemId, quantity]) => {
        return {
          itemId: Number(itemId),
          quantity,
        };
      });

      const payload = {
        restaurantId: +restaurantId,
        items,
      };

      await createOrder(payload);
      dispatchToast("success", "Order Placed successfully");
      setCart({});
    } catch (error: any) {
      const errors = extractErrors(error);
      dispatchToast("error", errors || "Something went wrong");
    }
  };

  const totalAmount = Object.entries(cart).reduce((total, [itemId, qty]) => {
    const item = data?.data?.find(
      (item: { id: number; price: number }) => item.id.toString() === itemId
    );
    return item ? total + item.price * qty : total;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans">
      <header className="bg-white fixed top-0 left-0 w-full py-5 px-6 flex items-center justify-between z-20">
        <h1 className="text-2xl font-bold text-gray-800">📜 Menu</h1>
      </header>

      <div className="fixed top-[70px] left-0 w-full bg-white px-4 py-2 z-10 border-b border-gray-200 sm:px-6">
        <div className="flex overflow-x-auto gap-2 sm:gap-3 no-scrollbar px-2 sm:px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={clsx(
                "px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-full border border-gray-300 transition-all",
                selectedCategory === category
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-32 space-y-10 px-4">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton count={4} className="h-28 w-full rounded-lg" />
          </div>
        ) : !data?.data || data?.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20 px-4 text-gray-700">
            <h2 className="text-xl font-semibold mb-2">No items available</h2>
            <p className="text-sm text-gray-500 max-w-md">
              We couldn't find any items for this menu. Please check back later
              or try a different restaurant.
            </p>
          </div>
        ) : selectedCategory === "All" ? (
          Object.keys(groupedMenu).map((category) => (
            <div key={category} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-700 mb-3 border-b-2 pb-2 border-gray-300">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {groupedMenu[category].map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    cart={cart}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700 mb-3 border-b-2 pb-2 border-gray-300">
              {selectedCategory}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {groupedMenu[selectedCategory]?.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  cart={cart}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>
        )}
        {Object.keys(cart).length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 z-30 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6">
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Total Items:{" "}
                <span className="font-semibold">
                  {Object.values(cart).reduce((a, b) => a + b, 0)}
                </span>
              </p>
              <p className="font-medium text-gray-700 text-sm sm:text-base">
                Total Amount:{" "}
                <span className="font-semibold">
                  ₹ {totalAmount.toFixed(2)}
                </span>
              </p>
            </div>
            <button
              onClick={handleSubmitOrder}
              className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-semibold transition-all duration-200"
              disabled={isCreateOrderPending}
            >
              {isCreateOrderPending ? "Placing..." : "Place Order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MenuItem = ({
  item,
  cart,
  onAdd,
  onRemove,
}: {
  item: any;
  cart: { [key: string]: number };
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}) => (
  <div
    className={clsx(
      "bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out p-4 border border-gray-200",
      !item.available && "grayscale"
    )}
  >
    <div className="flex flex-col justify-between h-full space-y-3">
      <Image
        imgPath={item?.image?.[0]}
        alt={item.name}
        className="w-full h-32 sm:h-40 md:h-44 object-cover rounded-lg mb-3"
        imageClassName="w-full h-32 sm:h-40 md:h-44 object-cover rounded-lg"
      />
      <div>
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2">
          {item.name}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
          ₹ {item.price}
        </p>
        {item.available ? (
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-700 text-center">
            Available
          </span>
        ) : (
          <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-700 text-center">
            Out of Stock
          </span>
        )}
      </div>

      {/* Add/Remove Buttons */}
      <div className="flex items-center justify-between mt-3">
        {cart[item.id] ? (
          <div className="flex items-center w-full justify-between bg-gray-100 rounded-lg p-2">
            <button
              onClick={() => onRemove(item.id)}
              className="text-lg font-bold text-gray-700 px-3 py-1 bg-gray-200 rounded-lg"
            >
              -
            </button>
            <span className="text-lg font-semibold">{cart[item.id]}</span>
            <button
              onClick={() => onAdd(item.id)}
              className="text-lg font-bold text-white px-3 py-1 bg-gray-900 rounded-lg"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAdd(item.id)}
            className="w-full py-2 text-sm font-semibold text-white bg-gray-900 rounded-lg"
            disabled={!item.available}
          >
            {item.available ? "Add to Cart" : "Unavailable"}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ViewMenu;
