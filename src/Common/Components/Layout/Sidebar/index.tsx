import clsx from "clsx";
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  { icon: "report", label: "Repors", path: ROUTES.REPORT.path },
];

const Sidebar: React.FC<SidebarProps> = ({
  toggleSidebar,
  isSidebarOpen = window.innerWidth >= 1200,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const storage = storageHelper("session");
  const activeItem: string =
    menuItems.find((el) => location.pathname.includes(el.path))?.label ||
    menuItems[0].label;

  const handleLogoClick = () => {
    navigate(ROUTES.DEFAULT.path);
  };
  const handleLogout = () => {
    storage.removeItem("token"); // Clear token from session storage
    navigate(ROUTES.LOGIN.path); // Redirect to login page
  };

  return (
    <div
      className={clsx(
        "fixed z-20 bg-gray-100 h-full transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Sidebar Header */}
      <div className="relative py-4 h-20 flex items-center">
        <div
          className={clsx(
            "relative cursor-pointer w-full ease-in-out duration-300 transition-all",
            isSidebarOpen ? "px-5" : "px-2 pr-3"
          )}
          onClick={handleLogoClick}
        >
          {isSidebarOpen ? <>Dine Desk</> : <>DD</>}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleSidebar();
            }}
            className={clsx(
              "absolute -right-3 top-2/4 -translate-y-2/4 z-10 bg-blue-800 border-2 border-solid border-white shadow-inner w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ease-in-out",
              isSidebarOpen ? "rotate-180" : "rotate-0"
            )}
          >
            <Icon name="leftArrow" />
          </div>
        </div>
      </div>

      {/* Sidebar Menu */}
      <ul className="pl-2.5 flex flex-col gap-5 h-[calc(100%-100px)] overflow-y-auto overflow-x-hidden mt-5">
        {menuItems.map((item, index) => (
          <Tooltip
            key={index}
            content={item.label}
            placement="right"
            className={clsx(isSidebarOpen ? "hidden" : "block")}
          >
            <li key={index} className="relative">
              <NavLink
                to={item.path}
                className={clsx(
                  "relative flex items-center gap-2 px-3 py-2 cursor-pointer after:transition-all after:duration-300 after:ease-in-out after:absolute after:right-0 after:h-full after:bg-transparent after:rounded-l-full hover:text-blue-800",
                  isSidebarOpen ? "after:w-2.5" : "after:w-5px",
                  activeItem === item.label ? "after:!bg-blue-800" : "",
                  activeItem === item.label ? "text-blue-800" : "text-gray-600"
                )}
              >
                <Icon
                  name={item.icon}
                  className="w-6 transition-all duration-300 ease-in-out"
                />
                <span
                  className={clsx(
                    "text-lg font-medium leading-6 truncate transition-all duration-300 ease-in-out",
                    isSidebarOpen ? "w-[calc(100%-32px)]" : "w-0"
                  )}
                >
                  {item.label}
                </span>
              </NavLink>
            </li>
          </Tooltip>
        ))}
      </ul>
      <div className="absolute bottom-4 left-0 w-full">
        <Tooltip
          content="Logout"
          placement="right"
          className={clsx(isSidebarOpen ? "hidden" : "block")}
        >
          {/* <div className="absolute bottom-4 left-0 w-full"> */}
          <button
            onClick={handleLogout}
            className={clsx(
              "relative flex items-center gap-2 w-full px-3 py-2 cursor-pointer transition-all",
              "after:transition-all after:duration-300 after:ease-in-out after:absolute after:right-0 after:h-full after:bg-transparent after:rounded-l-full",
              "hover:text-red-600",
              isSidebarOpen ? "after:w-2.5" : "after:w-[5px]",
              "text-gray-600"
            )}
          >
            <Icon
              name="logout"
              className="w-6 transition-all duration-300 ease-in-out"
            />
            <span
              className={clsx(
                "text-lg font-medium leading-6 truncate transition-all duration-300 ease-in-out",
                isSidebarOpen ? "w-[calc(100%-32px)]" : "w-0"
              )}
            >
              Logout
            </span>
          </button>
          {/* </div> */}
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
