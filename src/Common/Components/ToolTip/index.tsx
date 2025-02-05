import Tippy, { TippyProps } from "@tippyjs/react";
import React, { ReactElement, ReactNode } from "react";
import "tippy.js/dist/tippy.css"; // Optional

const Tooltip: React.FC<TippyProps> = ({
  children,
  className,
  ...tippyProps
}) => {
  const childElement: ReactElement = React.isValidElement(children) ? (
    children
  ) : (
    <span>{children as ReactNode}</span>
  );

  return (
    <Tippy className={`${className}`} {...tippyProps}>
      {childElement}
    </Tippy>
  );
};

export default Tooltip;
