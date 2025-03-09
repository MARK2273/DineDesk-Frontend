import { useEffect, useState } from "react";
import Image from "@dine-desk/Common/Components/Image";
import { useGetItemList } from "@dine-desk/api/item";
import { useParams } from "react-router-dom";
import { Skeleton } from "@dine-desk/Common/Components/Skeleton";
import clsx from "clsx";

const ViewMenu = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const { data, isLoading } = useGetItemList(menuId);
  const [groupedMenu, setGroupedMenu] = useState<Record<string, any[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (data) {
      const grouped = data.reduce((acc: any, item: any) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item);
        return acc;
      }, {});
      setGroupedMenu(grouped);
    }
  }, [data]);

  const categories = ["All", ...Object.keys(groupedMenu)];

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans">
      {/* Header */}
      <header className="bg-white fixed top-0 left-0 w-full py-5 px-6 flex items-center justify-between z-20">
        <h1 className="text-2xl font-bold text-gray-800">📜 Menu</h1>
      </header>

      {/* Fixed Category Bar */}
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

      {/* Menu Items */}
      <div className="mt-32 space-y-10 px-4">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton count={4} className="h-28 w-full rounded-lg" />
          </div>
        ) : selectedCategory === "All" ? (
          Object.keys(groupedMenu).map((category) => (
            <div key={category} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-700 mb-3 border-b-2 pb-2 border-gray-300">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {groupedMenu[category].map((item) => (
                  <MenuItem key={item.id} item={item} />
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
                <MenuItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Menu Item Component
const MenuItem = ({ item }: { item: any }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out p-4 border border-gray-200">
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
    </div>
  </div>
);

export default ViewMenu;
