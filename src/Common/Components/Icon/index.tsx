/// <reference types="vite-plugin-svgr/client" />

import { SVGAttributes } from "react";

import LeftArrow from "../../../assets/svg/LeftArrow.svg?react";
import Errorsvg from "../../../assets/svg/Errorsvg.svg?react";
import Home from "../../../assets/svg/Home.svg?react";
import Menu from "../../../assets/svg/Menu.svg?react";
import Restaurant from "../../../assets/svg/Restaurant.svg?react";
import Order from "../../../assets/svg/Order.svg?react";
import Dashbaord from "../../../assets/svg/Dashbaord.svg?react";
import Report from "../../../assets/svg/Report.svg?react";
import Close from "../../../assets/svg/Close.svg?react";
import NoDataFound from "../../../assets/svg/NoDataFound.svg?react";
import Search from "../../../assets/svg/Search.svg?react";
import PaginationLeftArrow from "../../../assets/svg/PaginationLeftarrow.svg?react";
import PaginationRightArrow from "../../../assets/svg/PaginationRightarrow.svg?react";
import AscSorting from "../../../assets/svg/AscSorting.svg?react";
import DescSorting from "../../../assets/svg/DescSorting.svg?react";
import Sorting from "../../../assets/svg/Sorting.svg?react";
import Edit from "../../../assets/svg/Edit.svg?react";
import Eye from "../../../assets/svg/Eye.svg?react";
import QRCode from "../../../assets/svg/QRCode.svg?react";
import Archive from "../../../assets/svg/Archive.svg?react";
import PasswordVisible from "../../../assets/svg/PasswordVisible.svg?react";
import PasswordEye from "../../../assets/svg/PasswordEye.svg?react";
import Logout from "../../../assets/svg/Logout.svg?react";
import Pdf from "../../../assets/svg/Pdf.svg?react";
import ChooseImage from "../../../assets/svg/ChooseImage.svg?react";
import Files from "../../../assets/svg/Files.svg?react";
import Revenue from "../../../assets/svg/Revenue.svg?react";
import ShopingBag from "../../../assets/svg/ShopingBag.svg?react";
import SchedulerDatePickerLeftArrow from "../../../assets/svg/SchedulerDatePickerLeftArrow.svg?react";
import SchedulerDatePickerRightArrow from "../../../assets/svg/SchedulerDatePickerRightArrow.svg?react";
import Calendar from "../../../assets/svg/Calendar.svg?react";
import SchedulerDatePickerClose from "../../../assets/svg/SchedulerDatepickerClose.svg?react";
import Image from "../Image";
import SectionLoader from "../Loader/Spinner";

export type IconNameType =
  | "leftArrow"
  | "errorsvg"
  | "home"
  | "menu"
  | "restaurant"
  | "order"
  | "report"
  | "dashboard"
  | "close"
  | "noDataFound"
  | "paginationLeftarrow"
  | "paginationRightarrow"
  | "search"
  | "ascSorting"
  | "descSorting"
  | "sorting"
  | "edit"
  | "eye"
  | "QRCode"
  | "archive"
  | "passwordVisible"
  | "passwordEye"
  | "pdf"
  | "chooseImage"
  | "files"
  | "revenue"
  | "shopingBag"
  | "logout"
  | "schedulerDatePickerLeftArrow"
  | "schedulerDatePickerRightArrow"
  | "calendar"
  | "schedulerDatePickerClose";

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
    const iconProps = { ...restProps };

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
      case "dashboard":
        return <Dashbaord {...iconProps} />;
      case "close":
        return <Close {...iconProps} />;
      case "noDataFound":
        return <NoDataFound {...iconProps} />;
      case "paginationLeftarrow":
        return <PaginationLeftArrow {...iconProps} />;
      case "paginationRightarrow":
        return <PaginationRightArrow {...iconProps} />;
      case "search":
        return <Search {...iconProps} />;
      case "ascSorting":
        return <AscSorting {...iconProps} />;
      case "descSorting":
        return <DescSorting {...iconProps} />;
      case "sorting":
        return <Sorting {...iconProps} />;
      case "edit":
        return <Edit {...iconProps} />;
      case "eye":
        return <Eye {...iconProps} />;
      case "archive":
        return <Archive {...iconProps} />;
      case "QRCode":
        return <QRCode {...iconProps} />;
      case "passwordVisible":
        return <PasswordVisible {...iconProps} />;
      case "passwordEye":
        return <PasswordEye {...iconProps} />;
      case "logout":
        return <Logout {...iconProps} />;
      case "restaurant":
        return <Restaurant {...iconProps} />;
      case "pdf":
        return <Pdf {...iconProps} />;
      case "chooseImage":
        return <ChooseImage {...iconProps} />;
      case "files":
        return <Files {...iconProps} />;
      case "revenue":
        return <Revenue {...iconProps} />;
      case "shopingBag":
        return <ShopingBag {...iconProps} />;
      case "schedulerDatePickerLeftArrow":
        return <SchedulerDatePickerLeftArrow {...iconProps} />;
      case "schedulerDatePickerRightArrow":
        return <SchedulerDatePickerRightArrow {...iconProps} />;
      case "calendar":
        return <Calendar {...iconProps} />;
      case "schedulerDatePickerClose":
        return <SchedulerDatePickerClose {...iconProps} />;
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
