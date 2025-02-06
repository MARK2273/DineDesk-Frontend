/* eslint-disable @typescript-eslint/no-empty-object-type */
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
  size,
  borderSize = "sm",
  onClick,
  active = false,
  isSquare = false,
  titleClassName,
  type,
  disabled,
  isLoading = false,
  rounded,
  text = "white",
  hoverText = "white",
  bg = "Primary-500",
  hoverBg = "dark",
  border = "primary",
  hoverBorder = "dark",
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  dataCopy?: string;
  hoverBg?: string;
  border?: string;
  hoverBorder?: string;
  children?: ReactNode;
  buttonRef?: React.LegacyRef<HTMLButtonElement> | undefined;
}) => {
  const classes = cx(
    className,
    `group font-bold outline-none inline-flex items-center  justify-center  transit leading-none rounded transition-all ${
      size === "xs" ? "text-xs gap-1" : "text-sm gap-1.5"
    }`,
    { "select-none": active || isLoading },
    { [`rounded-${rounded}`]: rounded },
    { rounded: !rounded },
    { "aspect-square": isSquare },
    { "h-6 px-1.5": size === "xs" },
    { "h-9 px-3": size === "sm" },
    { "h-10 px-4": size === "md" },
    { "h-11 px-5": size === "lg" },
    {
      [`bg-${bg} hover:bg-${hoverBg} text-${text} hover:text-${hoverText} `]:
        variant === "filled",
    },
    {
      [` ${
        borderSize === "md" ? "border-2" : "border"
      } border-${border} hover:border-${hoverBorder} bg-${bg} hover:bg-${hoverBg} text-${text} hover:text-${hoverText} `]:
        variant === "outline",
    },
    { "opacity-50 cursor-not-allowed": disabled || isLoading }
  );

  return isLink && href ? (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  ) : (
    <button
      onClick={onClick}
      type={type}
      // data-copy={dataCopy}
      className={classes}
      ref={buttonRef}
      disabled={disabled}
    >
      {children && children}
      {isLoading ? (
        <span className="relative h-4 w-4 border-[3px] border-Gray-900 border-b-white rounded-full block animate-spin" />
      ) : iconFirst && icon ? (
        <span className="">{icon}</span>
      ) : null}
      {title && <span className={titleClassName}>{title}</span>}
      {!iconFirst && icon ? <span className="text-lg">{icon}</span> : null}
    </button>
  );
};

export default Button;
