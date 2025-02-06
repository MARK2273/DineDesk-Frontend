// import NotFound from "@dine-desk/";
import { RouteObject } from "react-router-dom";
import NotFound from "../Common/Components/NotFound";
import Dashboard from "../components/Pages/Dashboard";
import Menu from "../components/Pages/Menu";
import Report from "../components/Pages/Report";
import Order from "../components/Pages/Order";
import Root from "../components/Pages/Root";
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
    | "REPORT"
    | "ORDER"]: {
    path: string;
    headerName?: string;
    routeType: "public" | "authenticate" | "un-authenticate";
    showHeader?: boolean;
    showFooter?: boolean;
    element: RouteObject["element"];
    errorElement?: RouteObject["errorElement"];
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
  NOT_FOUND: {
    path: "*",
    routeType: "public",
    element: <NotFound path={"/"} />,
  },
};
