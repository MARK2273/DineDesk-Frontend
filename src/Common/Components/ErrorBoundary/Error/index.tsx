import { useNavigate } from "react-router-dom";
import Icon from "../../Icon";
import Button from "../../Button";

interface ErrorProps {
  path?: string;
}

const Error: React.FC<ErrorProps> = ({ path }) => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-30px">
        <Icon name="errorsvg" />
        <div className="flex flex-col items-center gap-3 -mt-10">
          <h3 className="text-30px font-medium leading-9 text-black">
            Something went wrong.
          </h3>
          {path && (
            <p className="text-xl font-normal leading-6 text-black">
              Please return to dashboard or try aging later
            </p>
          )}
        </div>
        {path && (
          <div className="inline-block mx-auto">
            <Button
              variant="filled"
              title="Back To Dashboard"
              className="px-6 py-3 rounded-lg"
              onClick={() => navigate(path)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;
