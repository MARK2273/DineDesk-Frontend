// ** Packages **
import { useRouteError } from "react-router-dom";
import Error from "./Error";

const ErrorElement = (props: any) => {
  const error = useRouteError();

  return <>{error ? <Error path={props.path} /> : null}</>;
};

export default ErrorElement;
