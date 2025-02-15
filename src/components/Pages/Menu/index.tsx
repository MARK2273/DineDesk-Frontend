import { useState } from "react";
import AddMenu from "./AddMenu";
import Button from "@dine-desk/Common/Components/Button";
import { useGetMenuList } from "@dine-desk/api/menu";

const Menu = () => {
  const [openAddOrderModal, setOpenAddOrderModal] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null); // Store selected menu for editing

  const { data } = useGetMenuList();

  return (
    <div>
      <h2 className="text-xl font-bold">Manage Menus</h2>

      {/* Add Menu Button */}
      <div className="my-4">
        <Button
          onClick={() => {
            setSelectedMenu(null); // Reset selected menu for adding a new one
            setOpenAddOrderModal(true);
          }}
          title="Add Menu"
          variant="filled"
          className="px-6 py-3 rounded-lg text-black cursor-pointer bg-blue-600"
        />
      </div>

      {/* List of Menus */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Menu List</h3>
        {data?.length > 0 ? (
          <ul className="space-y-2">
            {data.map((menu: any) => (
              <li
                key={menu.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
                <span className="text-gray-700">{menu.name}</span>
                <Button
                  title="Edit"
                  onClick={() => {
                    setSelectedMenu(menu);
                    setOpenAddOrderModal(true);
                  }}
                  variant="filled"
                  className="px-6 py-3 rounded-lg text-black cursor-pointer bg-blue-600"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No menus available</p>
        )}
      </div>

      {/* Add/Edit Menu Modal */}
      {openAddOrderModal && (
        <AddMenu
          onClose={() => setOpenAddOrderModal(false)}
          open={openAddOrderModal}
          isEdit={!!selectedMenu}
          id={selectedMenu?.id}
        />
      )}
    </div>
  );
};

export default Menu;
