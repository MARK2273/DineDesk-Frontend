/// <reference types="vite-plugin-svgr/client" />

import { SVGAttributes } from "react";

import LeftArrow from "../../../assets/svg/LeftArrow.svg?react";
import Errorsvg from "../../../assets/svg/Errorsvg.svg?react";
import Home from "../../../assets/svg/Home.svg?react";
import Image from "../Image";
import SectionLoader from "../Loader/Spinner";

export type IconNameType = "leftarrow" | "errorsvg" | "home";

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
      case "leftarrow":
        return <LeftArrow {...iconProps} />;
      case "errorsvg":
        return <Errorsvg {...iconProps} />;
      case "home":
        return <Home {...iconProps} />;
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
