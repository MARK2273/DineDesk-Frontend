import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import { storageHelper } from "@dine-desk/helper/storageHelper";
import { PropsWithChildren, Suspense } from "react";
import { Navigate } from "react-router-dom";

const AuthenticateRoute: React.FC<
  PropsWithChildren & { navigatePath?: string; userType?: "admin" | "contact" }
> = ({ children }) => {
  const storage = storageHelper("session");
  const accessToken = storage.getItem("token");

  if (accessToken) {
    return <Suspense fallback={<SectionLoader />}>{children}</Suspense>;
  }

  return <Navigate to={ROUTES.LOGIN.path} />;
};

export default AuthenticateRoute;
