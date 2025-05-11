import cx from "clsx";
import { ReactNode } from "react";

export const Button = ({
  isLink = false,
  href,
  className = "",
  title,
  icon = false,
  iconFirst = false,
  variant,
  size = "md",
  borderSize = "sm",
  onClick,
  // active = false,
  isSquare = false,
  titleClassName,
  type,
  disabled,
  isLoading = false,
  rounded = "md",
  text = "white",
  hoverText = "white",
  bg = "yellow-500",
  hoverBg = "yellow-600",
  border = "yellow-500",
  hoverBorder = "yellow-600",
  children,
  buttonRef,
}: {
  isLink?: boolean;
  href?:
    | string
    | {
        pathname: string;
        query: {};
      };
  className?: string;
  title?: string;
  icon?: ReactNode;
  iconFirst?: boolean;
  onClick?: any;
  active?: boolean;
  isSquare?: boolean;
  titleClassName?: string;
  type?: "submit" | "reset" | "button";
  variant: "filled" | "outline" | "none";
  size?: "xs" | "sm" | "md" | "lg";
  borderSize?: "sm" | "md";
  disabled?: boolean;
  isLoading?: boolean;
  rounded?: "xs" | "sm" | "md" | "lg" | "full";
  text?: string;
  hoverText?: string;
  bg?: string;
  hoverBg?: string;
  border?: string;
  hoverBorder?: string;
  children?: ReactNode;
  buttonRef?: React.LegacyRef<HTMLButtonElement> | undefined;
}) => {
  const baseClasses = cx(
    "group font-medium outline-none inline-flex items-center justify-center transition-all",
    "focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50",
    "active:scale-[0.98] transition-transform duration-75",
    {
      "select-none cursor-not-allowed": disabled || isLoading,
      "cursor-pointer": !disabled && !isLoading,
    }
  );

  const sizeClasses = cx(
    {
      "text-xs px-2 h-6 gap-1": size === "xs",
      "text-sm px-3 h-8 gap-1.5": size === "sm",
      "text-base px-4 h-10 gap-2": size === "md",
      "text-lg px-5 h-12 gap-2.5": size === "lg",
    },
    {
      "aspect-square": isSquare,
      "px-2": isSquare && size === "xs",
      "px-3": isSquare && size === "sm",
      "px-4": isSquare && size === "md",
      "px-5": isSquare && size === "lg",
    }
  );

  const roundedClasses = cx({
    "rounded-xs": rounded === "xs",
    "rounded-sm": rounded === "sm",
    "rounded-md": rounded === "md",
    "rounded-lg": rounded === "lg",
    "rounded-full": rounded === "full",
  });

  const variantClasses = cx(
    {
      [`bg-${bg} text-${text} hover:bg-${hoverBg} hover:text-${hoverText}`]:
        variant === "filled",
      [`border ${
        borderSize === "md" ? "border-2" : "border"
      } border-${border} text-${border} hover:border-${hoverBorder} hover:text-${hoverBorder} bg-transparent`]:
        variant === "outline",
      "bg-transparent": variant === "none",
    },
    {
      "opacity-70": disabled,
      "hover:shadow-md": !disabled && variant !== "none",
    }
  );

  const loadingSpinner = (
    <span className="relative flex items-center justify-center">
      <span className="absolute h-4 w-4 border-2 border-current border-b-transparent rounded-full animate-spin" />
    </span>
  );

  const iconContent = icon && (
    <span
      className={cx(
        "flex items-center justify-center",
        {
          "text-lg": size === "md" || size === "lg",
          "text-base": size === "sm",
          "text-sm": size === "xs",
        },
        isLoading ? "" : "visible"
      )}
    >
      {icon}
    </span>
  );

  const titleContent = title && (
    <span
      className={cx(
        titleClassName,
        isLoading ? "" : "visible",
        "whitespace-nowrap"
      )}
    >
      {title}
    </span>
  );

  const classes = cx(
    baseClasses,
    sizeClasses,
    roundedClasses,
    variantClasses,
    className
  );

  return isLink && href ? (
    <></>
  ) : (
    <button
      onClick={onClick}
      type={type}
      className={classes}
      ref={buttonRef}
      disabled={disabled || isLoading}
    >
      {children && children}
      {iconFirst && iconContent}
      {isLoading ? (
        <span className="flex items-center gap-5">
          {titleContent}
          {loadingSpinner}
        </span>
      ) : (
        titleContent
      )}
      {!iconFirst && iconContent}
    </button>
  );
};

export default Button;
