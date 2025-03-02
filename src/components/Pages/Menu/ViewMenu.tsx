import { useEffect, useState } from "react";
import Image from "@dine-desk/Common/Components/Image"; // Adjust the import path as necessary
import { useGetItemList } from "@dine-desk/api/item";
import { useParams } from "react-router-dom";
import { Skeleton } from "@dine-desk/Common/Components/Skeleton";

const ViewMenu = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const { data, isLoading } = useGetItemList(menuId);
  const [groupedMenu, setGroupedMenu] = useState<Record<string, any[]>>({});

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

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <header className="bg-white fixed top-0 left-0 w-full shadow-md py-5 px-6 flex items-center justify-between z-10">
        <h1 className="text-2xl font-bold text-gray-800">📜 Menu</h1>
      </header>

      <div className="mt-20 space-y-10">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton count={4} className="h-28 w-full rounded-lg" />
          </div>
        ) : (
          Object.keys(groupedMenu).map((category) => (
            <div key={category} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-700 mb-3 border-b-2 pb-2 border-gray-300">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedMenu[category].map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out p-5 border border-gray-200"
                  >
                    <div className="flex flex-col justify-between h-full space-y-3">
                      <Image
                        imgPath={item?.image?.[0]} // Assuming `imageUrl` is the field containing the image path
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                        imageClassName="w-full h-40 object-cover rounded-lg"
                      />

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{item.price}
                        </p>
                        {item.available ? (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            Available
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewMenu;
