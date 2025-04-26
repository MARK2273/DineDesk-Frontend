import clsx from "clsx";
import { ReactNode } from "react";
import Modal, { ModalProps } from ".";
import Button from "../Button";
import Icon, { IconNameType } from "../Icon";

interface ConfirmModalProps extends ModalProps {
  onConfirm: () => void;
  confirmButtonTitle?: string;
  cancelButtonTitle?: string;
  buttonClassName?: string;
  cancelButtonClassName?: string;
  titleClassName?: string;
  showConfirm?: boolean;
  showCancel?: boolean;
  customButton?: ReactNode;
  customButtonPlacement?: "start" | "end";
  isLoading?: boolean;
  iconName?: IconNameType; // Custom icon
  iconBackgroundClassName?: string; // Background styling for the icon
  confirmButtonColor?: string;
  message?: string; // Message to display below the heading
  header?: string; // Header text
  iconclassName?: string;
  parentClassName?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onConfirm,
  children,
  confirmButtonTitle = "Confirm",
  cancelButtonTitle = "Confirm",
  buttonClassName,
  cancelButtonClassName,
  titleClassName,
  showCancel = false,
  showConfirm = true,
  customButton,
  customButtonPlacement = "start",
  isLoading = false,
  iconName = "archive",
  message,
  header,
  iconclassName,
  parentClassName,
  iconBackgroundClassName = "bg-Red-100",
  ...props
}) => {
  return (
    <Modal
      {...props}
      isLoading={isLoading}
      width="xxs"
      footer={
        <div
          className={`w-full gap-4 flex ml-auto justify-between  ${parentClassName}`}
        >
          {customButtonPlacement === "start" && customButton}
          {showCancel && (
            <Button
              variant="filled"
              title={cancelButtonTitle}
              className={clsx(
                "py-4 px-0 sm:px-5 rounded-lg bg-Primary-800 text-xs font-semibold w-2/4 hover:bg-gray-200",
                cancelButtonClassName
              )}
              titleClassName={titleClassName}
              onClick={props?.onClose}
              disabled={isLoading}
            />
          )}
          {showConfirm && (
            <Button
              isLoading={isLoading}
              disabled={isLoading}
              variant="filled"
              title={confirmButtonTitle}
              className={clsx(
                "py-4 px-0 sm:px-5 rounded-lg text-white text-xs font-semibold leading-14px w-2/4",
                buttonClassName
              )}
              onClick={onConfirm}
            />
          )}
          {customButtonPlacement === "end" && customButton}
        </div>
      }
    >
      {children ? (
        children
      ) : (
        <div className="flex items-center flex-col gap-4">
          {" "}
          <div
            className={clsx(
              "w-16 h-16 flex items-center justify-center rounded-full",
              iconBackgroundClassName
            )}
          >
            {iconName && (
              <Icon
                name={iconName}
                className={`icon-wrapper ${iconclassName}`}
              />
            )}
          </div>
          <h2 className="text-xl font-semibold">{header}</h2>
          {message && <p className="text-base text-Primary-900">{message}</p>}
        </div>
      )}
    </Modal>
  );
};

export default ConfirmModal;
