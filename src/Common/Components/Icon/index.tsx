/// <reference types="vite-plugin-svgr/client" />

import { SVGAttributes } from "react";

import LeftArrow from "../../../assets/svg/LeftArrow.svg?react";
import Errorsvg from "../../../assets/svg/Errorsvg.svg?react";
import Home from "../../../assets/svg/Home.svg?react";
import Menu from "../../../assets/svg/Menu.svg?react";
import Order from "../../../assets/svg/Order.svg?react";
import Dashbaord from "../../../assets/svg/Dashbaord.svg?react";
import Report from "../../../assets/svg/Report.svg?react";
import Close from "../../../assets/svg/Close.svg?react";
import Image from "../Image";
import SectionLoader from "../Loader/Spinner";

export type IconNameType =
  | "leftArrow"
  | "errorsvg"
  | "home"
  | "menu"
  | "order"
  | "report"
  | "dashbaord"
  | "close";

type IconProps = {
  name: IconNameType;
  iconType?: "default" | "custom";
  className?: string;
  svgWrapperClass?: string;
  onClick?: (..._args: any[]) => void;
  iIconStyle?: { backgroundColor: string };
  title?: string;
  spinner?: boolean;
  fill?: string;
  stroke?: string;
} & SVGAttributes<SVGElement>;

const Icon = ({
  name,
  iconType = "default",
  className = "",
  svgWrapperClass = "",
  iIconStyle,
  onClick,
  spinner,
  fill,
  stroke,
  ...restProps
}: IconProps) => {
  const dynamicStyle = {
    color: fill,
    stroke,
    ...iIconStyle,
  };
  const renderIcon = (icon: IconNameType) => {
    const iconProps = { ...restProps }; // No need to pass fill/stroke explicitly now

    switch (icon) {
      case "leftArrow":
        return <LeftArrow {...iconProps} />;
      case "errorsvg":
        return <Errorsvg {...iconProps} />;
      case "home":
        return <Home {...iconProps} />;
      case "menu":
        return <Menu {...iconProps} />;
      case "order":
        return <Order {...iconProps} />;
      case "report":
        return <Report {...iconProps} />;
      case "dashbaord":
        return <Dashbaord {...iconProps} />;
      case "close":
        return <Close {...iconProps} />;
      default:
        return <></>;
    }
  };

  const renderIconContent = () => {
    if (iconType === "default") {
      return (
        <>
          {spinner ? (
            <SectionLoader />
          ) : (
            <div className={svgWrapperClass}>{renderIcon(name)}</div>
          )}
        </>
      );
    }
    if (iconType === "custom") {
      return <Image imgPath={name} serverPath width={32} height={32} />;
    }
    return <></>;
  };

  return (
    <div className={className} onClick={onClick} style={dynamicStyle}>
      {renderIconContent()}
    </div>
  );
};

export default Icon;
