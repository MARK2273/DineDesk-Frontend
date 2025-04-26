import { Suspense } from "react";
import SectionLoader from "../Common/Components/Loader/Spinner";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { ROUTES } from "../constants/RoutePath";
import ErrorElement from "../Common/Components/ErrorBoundary/ErrorElement";
import AppLayout from "../Common/Components/Layout";
import ErrorBoundary from "../Common/Components/ErrorBoundary";
import AuthenticateRoute from "./RouteGuard/AuthenticateRoute";

const applySuspense = (routes: RouteObject[]): RouteObject[] => {
  return routes.map((route) => ({
    ...route,
    element: <Suspense fallback={<SectionLoader />}>{route.element}</Suspense>,
  }));
};

export const RoutesArray: RouteObject[] = applySuspense([
  ...Object.keys(ROUTES).map((key) => {
    const route = ROUTES[key as keyof typeof ROUTES];

    const routeObj: RouteObject = {
      path: route.path,
      element: route.element,
      errorElement: route.errorElement || <ErrorElement />,
    };

    if (route.routeType === "authenticate") {
      routeObj["element"] = (
        <>
          <AuthenticateRoute>
            {ROUTES.DEFAULT.path !== route.path ? (
              <AppLayout>
                <ErrorBoundary path={ROUTES.DASHBOARD.path}>
                  {route.element}
                </ErrorBoundary>
              </AppLayout>
            ) : (
              <>{route.element}</>
            )}
          </AuthenticateRoute>
        </>
      );
    } else if (route.routeType === "un-authenticate") {
      routeObj["element"] = (
        // <UnAuthenticateRoute>
        <div>{route.element}</div>
        // </UnAuthenticateRoute>
      );
    }

    return routeObj;
  }),
]);

const AllRoute = createBrowserRouter(RoutesArray);

const Route = () => <RouterProvider router={AllRoute} />;

export default Route;
