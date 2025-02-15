import clsx from "clsx";
import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import Icon from "../Icon";

export interface ModalProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title?: string;
  hideCloseIcon?: boolean;
  additionalIcon?: JSX.Element;
  width?: "sm" | "md" | "xs" | "xxs" | "lg";
  ParentClassName?: string;
  TitleClassname?: string;
  footer?: JSX.Element;
  MainContentParentClassName?: string;
  fullScreen?: boolean;
  isLoading?: boolean;
  footerclassName?: string;
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  children,
  onClose,
  title,
  ParentClassName,
  TitleClassname,
  hideCloseIcon = false,
  fullScreen = false,
  additionalIcon,
  width = "md",
  MainContentParentClassName,
  footer,
  isLoading = false,
  footerclassName,
  id = "modal-root",
}) => {
  if (!open) return null;

  return createPortal(
    <div
      id={id}
      className={clsx(
        "fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center",
        ParentClassName
      )}
    >
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out w-full max-w-lg p-6",
          {
            "max-w-xl": width === "lg",
            "max-w-md": width === "md",
            "max-w-sm": width === "sm",
            "max-w-xs": width === "xs",
            "max-w-[300px]": width === "xxs",
            "w-full h-full rounded-none": fullScreen,
          }
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between bg-gray-100 px-5 py-4 rounded-t-lg">
            <h5
              className={clsx(
                "text-lg font-semibold text-gray-700",
                TitleClassname
              )}
            >
              {title}
            </h5>
            <div className="flex items-center gap-2">
              {additionalIcon}
              {!hideCloseIcon && (
                <Icon
                  name="close"
                  className="cursor-pointer hover:text-red-500"
                  onClick={!isLoading ? onClose : undefined}
                />
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          className={clsx("p-5 overflow-y-auto", MainContentParentClassName, {
            "max-h-[70vh]": !fullScreen,
            "h-[90vh]": fullScreen,
          })}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={clsx("p-4 border-t border-gray-200", footerclassName)}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
export * from "./ConfirmModal";
