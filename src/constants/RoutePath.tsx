// import NotFound from "@dine-desk/";
import { RouteObject } from "react-router-dom";
import NotFound from "../Common/Components/NotFound";
import Dashboard from "../components/Pages/Dashboard";
import Menu from "../components/Pages/Menu";
import Report from "../components/Pages/Report";
import Order from "../components/Pages/Order";
import Login from "../components/Pages/Login";
import Root from "../components/Pages/Root";
import AddEditItem from "../components/Pages/Menu/AddEditItem";
import ViewMenu from "@dine-desk/components/Pages/Menu/ViewMenu";

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
    | "ADD_EDIT_MENU"
    | "VIEW_MENU"
    | "REPORT"
    | "ORDER"
    | "LOGIN"]: {
    path: string;
    headerName?: string;
    routeType: "public" | "authenticate" | "un-authenticate";
    showHeader?: boolean;
    showFooter?: boolean;
    element: RouteObject["element"];
    errorElement?: RouteObject["errorElement"];
  };
} & {
  [key in "ADD_EDIT_MENU" | "VIEW_MENU"]: {
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
  },
  MENU: {
    path: "/menu",
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <Menu />,
  },
  ADD_EDIT_MENU: {
    path: "/menu/:menuId",
    navigatePath: (menuId) => `/menu/${menuId}`,
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    headerName: "Add Edit Menu",
    element: <AddEditItem />,
  },
  VIEW_MENU: {
    path: "/view-menu/:menuId",
    navigatePath: (menuId) => `/view-menu/${menuId}`,
    routeType: "public",
    showHeader: false,
    showFooter: false,
    headerName: "View menu",
    element: <ViewMenu />,
  },
  REPORT: {
    path: "/report",
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <Report />,
  },
  ORDER: {
    path: "/order",
    routeType: "authenticate",
    showHeader: true,
    showFooter: true,
    element: <Order />,
  },
  LOGIN: {
    path: "/login",
    routeType: "public",
    showHeader: true,
    showFooter: true,
    element: <Login />,
  },
  NOT_FOUND: {
    path: "*",
    routeType: "public",
    element: <NotFound path={"/"} />,
  },
};
