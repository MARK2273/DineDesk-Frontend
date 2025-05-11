import clsx from "clsx";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../../../constants/RoutePath";
import Tooltip from "../../ToolTip";
import Icon, { IconNameType } from "../../Icon";
import { storageHelper } from "@dine-desk/helper/storageHelper";

interface SidebarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const menuItems: { icon: IconNameType; label: string; path: string }[] = [
  { icon: "dashboard", label: "Dashboard", path: ROUTES.DASHBOARD.path },
  { icon: "restaurant", label: "Restaurant", path: ROUTES.RESTAURANT.path },
  { icon: "menu", label: "Menu", path: ROUTES.MENU.path },
  { icon: "order", label: "Orders", path: ROUTES.ORDER.path },
  { icon: "report", label: "Reports", path: ROUTES.REPORT.path },
];

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const storage = storageHelper("session");

  const handleLogoClick = () => {
    toggleSidebar();
  };
  const handleLogout = () => {
    storage.removeItem("token");
    navigate(ROUTES.LOGIN.path);
  };

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 z-20 bg-white shadow-lg transition-all duration-300 ease-in-out",
        "flex flex-col border-r border-gray-200",
        isSidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center h-16 px-4 cursor-pointer",
          "bg-yellow-100 border-b border-yellow-200"
        )}
        onClick={handleLogoClick}
      >
        {isSidebarOpen ? (
          <span className="text-xl font-bold text-yellow-800">Dine Desk</span>
        ) : (
          <span className="text-xl font-bold text-yellow-800">DD</span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Tooltip
                content={item.label}
                placement="right"
                disabled={isSidebarOpen}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center p-3 mx-2 rounded-lg transition-colors",
                      "hover:bg-yellow-50 hover:text-yellow-700",
                      isActive
                        ? "bg-yellow-100 text-yellow-700"
                        : "text-gray-600",
                      isSidebarOpen ? "justify-start" : "justify-center"
                    )
                  }
                >
                  <Icon name={item.icon} />
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </NavLink>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 ">
        <Tooltip content="Logout" placement="right" disabled={isSidebarOpen}>
          <button
            onClick={handleLogout}
            className={clsx(
              "flex items-center w-full p-3 rounded-lg transition-colors cursor-pointer",
              "hover:bg-red-50 hover:text-red-600 text-gray-600",
              isSidebarOpen ? "justify-start" : "justify-center"
            )}
          >
            <Icon name="logout" />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;
