import { useNavigate } from "react-router-dom";
import Button from "../../../Common/Components/Button";
import { ROUTES } from "../../../constants/RoutePath";

const Root = () => {
  const Navigate = useNavigate();
  return (
    <div>
      <Button
        title="Go TO Dashboard"
        variant="filled"
        onClick={() => Navigate(ROUTES.DASHBOARD.path)}
        className="bg-Primary-500 px-6 py-2.5 !leading-[16px] w-full sm:w-[calc(50%-13px)] md:w-1/3 lg:w-auto sm:order-6 lg:order-none border border-solid !border-Primary-500"
      />
    </div>
  );
};

export default Root;
