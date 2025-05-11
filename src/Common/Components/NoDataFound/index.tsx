import Icon from "../Icon";
import Button from "../Button";
import clsx from "clsx";

interface NoDataFoundProps {
  title?: string;
  description?: string | React.ReactNode;
  className?: string;
  iconName?: string;
  actionText?: string;
  onAction?: () => void;
  fullHeight?: boolean;
}

export const NoDataFound: React.FC<NoDataFoundProps> = ({
  title = "No Data Found",
  description = "We couldn't retrieve any data at the moment",
  className,
  actionText,
  onAction,
  fullHeight = true,
}) => {
  return (
    <div
      className={clsx(
        "w-full flex items-center justify-center",
        fullHeight ? "min-h-[50vh]" : "my-10",
        className
      )}
    >
      <div className="flex flex-col items-center text-center max-w-md px-4 py-8 space-y-6">
        <div className="text-yellow-500">
          <Icon name="noDataFound" className="w-20 h-20 mx-auto" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          {typeof description === "string" ? (
            <p className="text-gray-500">{description}</p>
          ) : (
            description
          )}
        </div>

        {actionText && onAction && (
          <Button variant="outline" onClick={onAction} className="mt-4">
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NoDataFound;
