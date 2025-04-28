// import NotFound from "@dine-desk/";
import { RouteObject } from "react-router-dom";
import NotFound from "../Common/Components/NotFound";
import Dashboard from "../components/Pages/Dashboard";
import Menu from "../components/Pages/Menu";
import Restaurant from "../components/Pages/Restaurant";
import Report from "../components/Pages/Report";
import Order from "../components/Pages/Order";
import Login from "../components/Pages/Login/Login";
import Root from "../components/Pages/Root";
import AddEditItem from "../components/Pages/Menu/AddEditItem";
import ViewMenu from "@dine-desk/components/Pages/Menu/ViewMenu";
import Register from "@dine-desk/components/Pages/Login/Register";
import EditOrder from "@dine-desk/components/Pages/Order/EditOrder";
import ViewOrder from "@dine-desk/components/Pages/Order/ViewOrder";

// import NotFound from "@dine-desk/Common/Components/NotFound";

// const Profile = React.lazy(
//   () => import("@entity-manager/components/Pages/Profile")
// );

export type RoutesType = {
  [key in
    | "DEFAULT"
    | "NOT_FOUND"
    | "DASHBOARD"
    | "MENU"
    | "RESTAURANT"
    | "ADD_EDIT_MENU"
    | "VIEW_MENU"
    | "EDIT_ORDER"
    | "VIEW_ORDER"
    | "REPORT"
    | "ORDER"
    | "LOGIN"
    | "REGISTER"]: {
    path: string;
    headerName?: string;
    routeType: "public" | "authenticate" | "un-authenticate";
    showHeader?: boolean;
    showFooter?: boolean;
    element: RouteObject["element"];
    errorElement?: RouteObject["errorElement"];
  };
} & {
  [key in "ADD_EDIT_MENU" | "VIEW_MENU" | "EDIT_ORDER" | "VIEW_ORDER"]: {
    navigatePath: (id: number | string) => string;
  };
};

export const ROUTES: RoutesType = {
  DEFAULT: {
    path: "/",
    routeType: "public",
    element: <Root />,
  },
  DASHBOARD: {
    path: "/dashboard",
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <Dashboard />,
    headerName: "Dashboard",
  },
  MENU: {
    path: "/menu",
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <Menu />,
    headerName: "Menus",
  },
  RESTAURANT: {
    path: "/restaurant",
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <Restaurant />,
    headerName: "Restaurants",
  },
  ADD_EDIT_MENU: {
    path: "/menu/:menuId",
    navigatePath: (menuId) => `/menu/${menuId}`,
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <AddEditItem />,
    headerName: "Add Edit Menu",
  },
  VIEW_MENU: {
    path: "/view-menu/:menuId",
    navigatePath: (menuId) => `/view-menu/${menuId}`,
    routeType: "public",
    showHeader: false,
    showFooter: false,
    element: <ViewMenu />,
    headerName: "View menu",
  },
  EDIT_ORDER: {
    path: "/order/:orderId",
    navigatePath: (orderId) => `/order/${orderId}`,
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <EditOrder />,
    headerName: "Add Edit Order",
  },
  VIEW_ORDER: {
    path: "/view-order/:orderId",
    navigatePath: (orderId) => `/view-order/${orderId}`,
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <ViewOrder />,
    headerName: "View Order",
  },
  REPORT: {
    path: "/report",
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <Report />,
    headerName: "Report",
  },
  ORDER: {
    path: "/order",
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <Order />,
    headerName: "Orders",
  },
  REGISTER: {
    path: "/register",
    routeType: "un-authenticate",
    showHeader: false,
    showFooter: false,
    element: <Register />,
  },
  LOGIN: {
    path: "/login",
    routeType: "public",
    showHeader: false,
    showFooter: false,
    element: <Login />,
  },
  NOT_FOUND: {
    path: "*",
    routeType: "public",
    element: <NotFound path={"/"} />,
  },
};
