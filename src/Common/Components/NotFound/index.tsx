// import { Button } from "@emr-web/common";
// import Icon from "@emr-web/common/components/Icon";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC<{ path: string }> = ({ path }) => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col gap-30px items-center">
        {/* <Icon name="notfound" /> */}
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-30px font-medium leading-9 text-black">
            Oops... Page not found
          </h3>
          <p className="text-xl font-normal leading-6 text-black">
            Sorry, We can’t find the page you’re looking for.
          </p>
        </div>
        <div className="inline-block mx-auto">
          {/* <Button
            variant="filled"
            title="Back To Dashboard"
            className="px-6 py-3 rounded-lg"
            onClick={() => navigate(path)}
          /> */}
          <div onClick={() => navigate(path)}>Back To Home</div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
